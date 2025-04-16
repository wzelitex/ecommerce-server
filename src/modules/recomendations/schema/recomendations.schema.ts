import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ discriminatorKey: 'type' })
export class RecomendationsBaseSchema extends Document {
  @Prop({ required: true, ref: 'Business' })
  businessId: Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop({ required: true, default: 0 })
  likes: number;
}

export const RecomendationsBaseSchemaFactory = SchemaFactory.createForClass(
  RecomendationsBaseSchema,
);

// Subdocumento para Recomendaciones
@Schema()
export class RecomendationsSchema extends RecomendationsBaseSchema {
  @Prop({ required: true })
  recomendation: string;
}

export const RecomendationsSchemaFactory =
  SchemaFactory.createForClass(RecomendationsSchema);

// Subdocumento para Comentarios
@Schema()
export class RecomendationsCommentsSchema extends RecomendationsBaseSchema {
  @Prop({ required: true, ref: 'Recomendations' })
  recomendationId: Types.ObjectId;

  @Prop({ required: true })
  comment: string;
}

export const RecomendationsCommentsSchemaFactory = SchemaFactory.createForClass(
  RecomendationsCommentsSchema,
);
