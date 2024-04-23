import { UpdateFilter } from "mongodb";
import mongoose, { Aggregate, AggregateOptions, Document, FilterQuery, Model, PipelineStage, PopulateOptions, ProjectionType, QueryOptions, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    constructor(
        protected readonly entityModel: Model<TDocument>
    ) { };
    async create(
        document: any,
    ): Promise<TDocument> {
        const entity = new this.entityModel({
            ...document
        });
        return entity.save();
    }

    async findOne(
        entityFilterQuery: FilterQuery<string | unknown>,
        projection?: ProjectionType<TDocument | null>,
        options?: QueryOptions<TDocument> | null
    ): Promise<TDocument | null> {
        return this.entityModel.findOne(
            entityFilterQuery,
            projection,
            options
        ).exec();
    }
    async findByIdAndUpdate(
        id: mongoose.ObjectId | string,
        update?: UpdateQuery<TDocument>,
        options?: QueryOptions<TDocument> | null
    ): Promise<TDocument | null> {
        return this.entityModel.findByIdAndUpdate(
            id,
            update,
            options
        ).exec();
    }
    async find(
        entityFilterQuery: FilterQuery<TDocument>,
        projection?: ProjectionType<TDocument | null>,
        options?: QueryOptions<TDocument> | null
    ): Promise<TDocument[] | null> {
        return this.entityModel.find(
            entityFilterQuery,
            projection,
            options
        ).exec();
    }
    async findById(
        id: mongoose.ObjectId | string,
        projection?: Record<string, Document>,
        options?: QueryOptions<TDocument> | null
    ): Promise<TDocument | null> {
        return await this.entityModel.findById(
            id,
            { _id: 0, __v: 0, ...projection },
            options
        ).exec();
    }
    async findOneAndUpdate(
        filterQuery: FilterQuery<TDocument>,
        updateQueryData: UpdateFilter<TDocument>
    ): Promise<TDocument | null> {
        return this.entityModel.findOneAndUpdate(
            filterQuery,
            updateQueryData
        ).exec();
    }
    
    async deleteOne(
        filterQuery: FilterQuery<TDocument>
    ): Promise<Boolean> {
        const deleteResult = await this.entityModel.deleteOne(filterQuery);
        return deleteResult.deletedCount >= 1;
    }
    async populate(
        docs: Array<any>,
        options: PopulateOptions | Array<PopulateOptions>
    ): Promise<Array<TDocument>> {
        return this.entityModel.populate(docs, options);
    }
    aggregate<R = any>(
        pipeline: PipelineStage[],
        options?: AggregateOptions,
    ): Aggregate<Array<R>> {
        return this.entityModel.aggregate(pipeline, options)
    }
}