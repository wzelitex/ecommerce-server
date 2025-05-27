import { forwardRef, Module } from '@nestjs/common';
import { UserBaseSchemaFactory } from '../users/schema/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilsModule } from '../utils/utils.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/middleware/auth.middleware';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Users',
        schema: UserBaseSchemaFactory,
      },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: process.env.AUTH_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    UtilsModule,
    JwtModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, MongooseModule],
})
export class AuthModule {}
