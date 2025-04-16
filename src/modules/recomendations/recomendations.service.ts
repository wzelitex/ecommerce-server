import { Injectable } from '@nestjs/common';
import {
  RecomendationsSchema,
  RecomendationsCommentsSchema,
} from './schema/recomendations.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRecomendationsInterface } from './interface/recomendations.interface';
import { SanitizeService } from '../utils/services/sanitize.service';
import { ResponseService } from '../utils/services/response.service';

@Injectable()
export class RecomendationsService {
  constructor(
    @InjectModel('Recomendation')
    private readonly recomendationModel: Model<RecomendationsSchema>,
    @InjectModel('Comment')
    private readonly commentsModel: Model<RecomendationsCommentsSchema>,
    private readonly sanitizeService: SanitizeService,
    private readonly responseService: ResponseService,
  ) {}

  private readonly limitDocuments = 10;

  /* Operations for recomendations */

  async getRecomendations(offset: string, limit?: number) {
    const recomendations = await this.recomendationModel
      .find()
      .sort({ date: -1 })
      .limit(limit ?? this.limitDocuments)
      .skip(parseInt(offset));
    if (recomendations.length === 0)
      return this.responseService.error(404, 'Recomendaciones no encontradas.');

    return this.responseService.success(
      200,
      'Recomendaciones encontradas.',
      recomendations,
    );
  }

  async createRecomendation(data: CreateRecomendationsInterface) {
    this.sanitizeService.sanitizeString(data.recomendation);
    const newDocument = new this.recomendationModel({
      ...data,
      businessId: new Types.ObjectId(data.businessId),
    });

    await newDocument.save();

    return this.responseService.success(
      201,
      'Recomendación creada exitosamente.',
      newDocument,
    );
  }

  async updateRecomendation(id: string, newText: string) {
    this.sanitizeService.sanitizeString(newText);

    await this.recomendationModel.findByIdAndUpdate(id, {
      recomendation: newText,
    });

    return this.responseService.success(
      200,
      'Recomendación actualizada correctamente.',
    );
  }

  async deleteRecomendation(id: string) {
    await this.recomendationModel.findByIdAndDelete(id);
    return await this.commentsModel.deleteMany({ recomendationId: id });
  }

  /* Operations for comments */
  async getCommentsByRecomendationId(id: string, offset: string) {
    const comments = await this.commentsModel
      .find({ recomendationId: id })
      .limit(this.limitDocuments)
      .skip(parseInt(offset));

    if (!comments || comments.length === 0)
      return this.responseService.error(404, 'Comentarios no encontrados.');

    return this.responseService.success(
      200,
      'Comentarios encontrados.',
      comments,
    );
  }

  async createComment(id: string, comment: string, userId: string) {
    this.sanitizeService.sanitizeString(comment);

    const newComment = new this.commentsModel({
      recomendationId: new Types.ObjectId(id),
      businessId: new Types.ObjectId(userId),
      comment: comment,
    });

    await newComment.save();

    return this.responseService.success(
      201,
      'Comentario creado correctamente.',
    );
  }

  async updateComment(id: string, comment: string) {
    this.sanitizeService.sanitizeString(comment);

    await this.commentsModel.findByIdAndUpdate(id, {
      comment: comment,
    });

    return this.responseService.success(
      200,
      'Comentario actualizado correctamente.',
    );
  }

  async deleteComment(id: string) {
    await this.commentsModel.findByIdAndDelete(id);
    return this.responseService.success(
      200,
      'Comentario eliminado correctamente.',
    );
  }
}
