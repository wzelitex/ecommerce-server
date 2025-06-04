import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { UserBaseSchema } from '../users/schema/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import {
  NewUserCollectionInterface,
  PayloadUserInterface,
} from './interface/interface.login';
import {
  LoginDto,
  SignupBusinessDto,
  SignupClientDto,
  SignupWorkerDto,
} from './dto/auth.dto';
import { ResponseService } from '../utils/services/response.service';
import { EncryptService } from '../utils/services/encrypt.service';
import { SanitizeService } from '../utils/services/sanitize.service';
import { ExternalUsersService } from '../users/utils/external/external.users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Users') private readonly authModel: Model<UserBaseSchema>,
    private readonly responseService: ResponseService,
    private readonly encryptService: EncryptService,
    private readonly jwtService: JwtService,
    private readonly usersService: ExternalUsersService,
    private readonly sanitizeService: SanitizeService,
  ) {}

  // function to renew access tokens
  async renewAccessToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<PayloadUserInterface>(
        refreshToken,
        { secret: process.env.AUTH_SECRET },
      );

      if (!payload)
        return this.responseService.error(409, 'Refresh token invalid.');

      const userFound = await this.usersService.getUserIdById(payload.userId);
      if (!userFound) return this.responseService.error(404, 'User no found.');

      const newAccessToken = await this.generateNewTokenAccess(
        payload.userId,
        payload.email,
        payload.type,
      );

      return this.responseService.success(
        201,
        'new access token.',
        newAccessToken,
      );
    } catch {
      return this.responseService.error(500, 'Error en el servidor.');
    }
  }

  async signupDelivery(data: SignupClientDto) {
    const user = await this.findUser(data.email);
    if (user) return this.responseService.error(409, 'user exist');

    const passwordHashed = await this.encryptService.hasher(data.password);

    const newDelivery = await this.usersService.createDelivery({
      password: passwordHashed,
      email: data.email,
      lada: data.lada,
      name: data.name,
      phone: data.phone,
    });

    await this.newUsersCollection({
      lada: data.lada,
      phone: data.phone,
      email: data.email,
      password: passwordHashed,
      type: 'delivery',
      userId: newDelivery._id.toString(),
    });

    const accessToken = await this.generateNewTokenAccess(
      newDelivery._id,
      data.email,
      'delivery',
    );

    const refreshToken = await this.generateNewTokenRefresh(newDelivery._id);

    return this.responseService.success(201, 'User created successfully', {
      access_token: accessToken,
      refresh_token: refreshToken,
      rol: 'delivery',
    });
  }

  async signupWorker(data: SignupWorkerDto) {
    const user = await this.findUser(data.email);
    if (user) return this.responseService.error(409, 'user exist');

    const business = await this.usersService.findBusiness(data.businessId);

    if (!business) return this.responseService.error(404, 'Business no found.');

    if (business.code !== data.code)
      return this.responseService.error(409, 'Code dont match.');

    const passwordHashed = await this.encryptService.hasher(data.password);

    const newUser = await this.usersService.createWorker({
      password: passwordHashed,
      email: data.email,
      lada: data.lada,
      name: data.name,
      phone: data.phone,
      businessId: new Types.ObjectId(data.businessId),
    });

    await this.newUsersCollection({
      lada: data.lada,
      phone: data.phone,
      email: data.email,
      password: passwordHashed,
      type: 'worker',
      userId: newUser._id.toString(),
    });

    const accessToken = await this.generateNewTokenAccess(
      newUser._id,
      data.email,
      'delivery',
    );

    const refreshToken = await this.generateNewTokenRefresh(newUser._id);

    return this.responseService.success(201, 'User created successfully', {
      access_token: accessToken,
      refresh_token: refreshToken,
      rol: 'worker',
    });
  }

  async signIn(data: LoginDto) {
    const user = await this.authModel.findOne({ email: data.email });

    if (!user) return this.responseService.error(404, 'User no found.');

    const isMatchPassword = await this.encryptService.compare(
      data.password,
      user.password,
    );

    if (!isMatchPassword)
      return this.responseService.error(409, 'password don´t match');

    const access_token = await this.generateNewTokenAccess(
      user.userId.toString(),
      user.email,
      user.type,
    );

    const refresh_token = await this.generateNewTokenRefresh(
      user.userId.toString(),
    );

    return this.responseService.success(201, 'User created successfully.', {
      access_token: access_token,
      refresh_token: refresh_token,
    });
  }

  async signUpClient(signupData: SignupClientDto) {
    const { email, password, phone, lada } = signupData;
    const user = await this.findUser(email);

    if (user) return this.responseService.error(409, 'User exist');

    const hashedPassword = await this.encryptService.hasher(password);
    const newUser = await this.usersService.createClient({
      ...signupData,
      password: hashedPassword,
    });

    await this.newUsersCollection({
      email: email,
      phone: phone,
      lada: lada,
      type: 'client',
      password: hashedPassword,
      userId: newUser._id,
    });

    const token_access = await this.generateNewTokenAccess(
      newUser._id,
      email,
      'client',
    );

    const token_refresh = await this.generateNewTokenRefresh(newUser._id);

    return this.responseService.success(201, 'User created successfully.', {
      access_token: token_access,
      refresh_token: token_refresh,
      rol: 'client',
    });
  }

  async signUpBusiness(signupData: SignupBusinessDto) {
    const { email, phone, password, lada } = signupData;

    const user = await this.findUser(email);
    if (user) return this.responseService.error(201, 'User exist.');

    const hashedPassword = await this.encryptService.hasher(password);
    const code = this.generateCode();

    const newBusiness = await this.usersService.createBusiness(
      {
        ...signupData,
        password: hashedPassword,
      },
      code,
    );

    await this.newUsersCollection({
      password: hashedPassword,
      email: email,
      lada: lada,
      phone: phone,
      type: 'business',
      userId: newBusiness._id,
    });

    const access_token = await this.generateNewTokenAccess(
      newBusiness._id,
      email,
      'business',
    );

    const refresh_token = await this.generateNewTokenRefresh(newBusiness._id);

    return this.responseService.success(201, 'User created successfully', {
      access_token: access_token,
      refresh_token: refresh_token,
    });
  }

  /* Functions private for the fucntions publics */

  private async generateNewTokenAccess(
    userId: string,
    email: string,
    rol: string,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      { userId, rol, email: email },
      {
        secret: process.env.AUTH_SECRET,
        expiresIn: '15d',
      },
    );
  }

  private async generateNewTokenRefresh(userId: string) {
    return await this.jwtService.signAsync(
      { userId: userId },
      {
        secret: process.env.AUTH_SECRET,
        expiresIn: '90d',
      },
    );
  }

  // POST new User collection users
  private async newUsersCollection(data: NewUserCollectionInterface) {
    this.sanitizeService.sanitizeString(data.email);
    const newUser = new this.authModel({
      ...data,
      userId: new Types.ObjectId(data.userId),
    });
    await newUser.save();
    return newUser;
  }

  private async findUser(correo: string) {
    return await this.authModel.findOne({ email: correo });
  }

  private generateCode(): string {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      code += charset[randomIndex];
    }
    return code;
  }
}
