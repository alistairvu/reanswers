import Question from "./question.model"
import Tag from "../tag/tag.model"
import mongoose from "mongoose"
import HTTPError from "../../httpError"
import { Request, Response, NextFunction } from "express"

// GET /api/questions
export const getQuestions = async (req: Request, res: Response, next: any) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const pageNumber = Number(req.query.page) || 1;
    const offset = pageSize * (pageNumber - 1);

    const questionAggregate = await Question.aggregate([
      {
        $facet: {
            questions: [
            {
              $sort: {
                createdAt: -1,
              },
            },
            { $skip: offset },
            { $limit: pageSize },
            {
              $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author",
              },
            },
            {
              $project: {
                author: {
                  password: 0,
                  __v: 0,
                },
                __v: 0,
                createdAt: 0,
                updatedAt: 0,
              },
            },
          ],
          count: [
            {
              $count: "questionCount",
            },
          ],
        },
      },
    ]);

    const { questions, count } = questionAggregate[0];
    const { questionCount } = count[0];
    const pageCount = Math.ceil(questionCount / pageSize);
    
    res.send({
      success: 1,
      pageNumber: pageNumber,
      pageCount: pageCount,
      data: questions,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/questions/:id
export const showQuestion = async (req: Request, res: Response, next: any) => {
  try {
    const question = await Question.findById(req.params.id)
      .select("-__v")
      .populate("author", "username");
    // .populate({
    //   path: "likedBy",
    //   populate: { path: "author", select: "username" },
    //   select: "-__v",
    // })
    // .populate({
    //     path: "comments",
    //     populate: { path: "comment", select: "username content" },
    //     select: "-__v",
    //   })

    if (!question) {
      throw new HTTPError("No matching questions found", 404);
    }

    res.send({ success: 1, data: question });
  } catch (err) {
    next(err);
  }
};

//POST /api/questions
export const createQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, body, imageUrl, tags } = req.body
    const author = req.user._id
    const tagIds: mongoose.Types.ObjectId[] = []

    for (let tag of tags) {
      await Tag.findOneAndUpdate(
        { title: tag },
        { $inc: { count: 1 } },
        { upsert: true }
      )
      const createdTag = await Tag.findOne({ title: tag })
      tagIds.push(createdTag._id)
    }

    const question = await Question.create({
      title,
      body,
      imageUrl,
      tags: tagIds,
      author,
    })

    res.send({ success: 1, data: question })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/questions/:id
export const deleteQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id)

    if (!question) {
      throw new HTTPError("No matching quetions found", 404)
    }

    if (question.author.toString() !== req.user._id.toString()) {
      throw new HTTPError("Action not allowed", 401)
    }

    res.send({ success: 1, deleted: 1 })
  } catch (err) {
    next(err)
  }
}
