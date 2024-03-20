import { Request, Response } from "express";
import Quiz from "@/models/quiz_model_admin";
import { Op } from "sequelize";

export const create_quiz = async (req: Request, res: Response) => {
  try {
    const {
      create_by,
      question,
      options,
      correct_ans,
      start_time,
      end_time,
      winning_price,
    } = req.body;

    if (
      !create_by ||
      !question ||
      !options ||
      !correct_ans ||
      !start_time ||
      !end_time
    ) {
      return res.status(400).json({
        status: "failed",
        message: "All fields are mandatory",
      });
    }

    if (
      winning_price === undefined ||
      winning_price === "" ||
      winning_price < 0
    ) {
      return res.status(400).json({
        status: "failed",
        message: "Please Enter Price 0 or more, cannot except negative number",
      });
    }

    // Parsing start time
    const [start_dd, start_mm, start_yyyy, start_hh, start_min, start_ss] =
      start_time.match(/\d+/g).map(Number);
    const startTime = new Date(
      start_yyyy,
      start_mm - 1,
      start_dd,
      start_hh,
      start_min,
      start_ss
    );

    // Parsing end time
    const [end_dd, end_mm, end_yyyy, end_hh, end_min, end_ss] = end_time
      .match(/\d+/g)
      .map(Number);
    const endTime = new Date(
      end_yyyy,
      end_mm - 1,
      end_dd,
      end_hh,
      end_min,
      end_ss
    );

    const formattedStartTime = `${startTime
      .getDate()
      .toString()
      .padStart(2, "0")}-${(startTime.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${startTime.getFullYear()} ${startTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${startTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${startTime.getSeconds().toString().padStart(2, "0")}`;
    const formattedEndTime = `${endTime
      .getDate()
      .toString()
      .padStart(2, "0")}-${(endTime.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${endTime.getFullYear()} ${endTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${endTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${endTime.getSeconds().toString().padStart(2, "0")}`;

    const quiz = await Quiz.create({
      create_by,
      question,
      options_json: JSON.stringify(options),
      correct_ans_json: JSON.stringify(correct_ans),
      start_time: formattedStartTime,
      end_time: formattedEndTime,
      winning_price,
    });

    return res.status(201).json({
      status: "success",
      message: "Quiz created successfully",
      // data: quiz,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};

export const viewlist_quiz = async (req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.findAll();

    return res.status(200).json({
      status: "success",
      message: "Quizzes retrieved successfully",
      data: quizzes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};

export const view_by_column = async (req: Request, res: Response) => {
  try {
    const { create_by } = req.body; // Get query parameters

    // Define a filter object to build the WHERE clause for Sequelize
    const filter: any = {};

    if (create_by) {
      filter.create_by = create_by;
    }

    const quizzes = await Quiz.findAll({
      where: filter,
    });

    return res.status(200).json({
      status: "success",
      message: "Quizzes retrieved successfully",
      data: quizzes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};

export const view_by_query = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.body; // Get the keyword query parameter

    // Define a filter object to build the WHERE clause for Sequelize
    const filter = {
      [Op.or]: [
        {
          question: {
            [Op.iLike]: `%${keyword}%`,
          },
        },
      ],
    };

    // Fetch quiz records based on the keyword filter
    const quizzes = await Quiz.findAll({
      where: filter,
    });

    return res.status(200).json({
      status: "success",
      message: "Quizzes retrieved successfully",
      data: quizzes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};

export const view_by_id = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    const quiz = await Quiz.findByPk(id);

    if (!quiz) {
      return res.status(200).json({
        status: "failed",
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Quiz retrieved successfully",
      data: quiz,
    });
  } catch (error) {
    console.error();
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};

export const quiz_delete = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const quiz = await Quiz.findByPk(id);

    if (!quiz) {
      return res.status(200).json({
        status: "failed",
        message: "Quiz not found",
      });
    }

    // Delete the quiz
    await quiz.destroy();

    return res.status(200).json({
      status: "success",
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};
