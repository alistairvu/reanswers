import Question from "./question.model";
import HTTPError from "../../httpError";
import { Request, Response, NextFunction } from "express";

// GET (all)

// GET (one)

//POST /api/questions/create
export const createQuestion = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    console.log(req.user._id);

    const { title, body, imageUrl, tags } = req.body;
    const author = req.user._id
    const question = await Question.create({
      title,
      body,
      imageUrl,
      tags,
      author
    });

    res.send({ success: 1, data: question });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/questions/:id
export const deleteQuestion = async (req: Request, res: Response, next: any) => {
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