export const search = try_and_catch_handler(async (req: Request, res: Response) => {
    const { skey, search_key } = req.body;
  
    const field_allowed = ['skey', 'search_key'];
  
    if (!validate_fields(req, res, field_allowed)) {
      return;
    }
  
    if (!skey || skey !== process.env.SKEY) {
      return send_error_response(res, 401, 'Unable to proceed');
    }
  
    const search_key_data = search_key ? search_key.trim() : search_key;
    
    const suggestions = await SuggestionModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search_key_data}%` } },
          { user_phone: { [Op.iLike]: `%${search_key_data}%` } },
          { title: { [Op.iLike]: `%${search_key_data}%` } },
          { description: { [Op.iLike]: `%${search_key_data}%` } },
        ],
      },
    });
  
    if (suggestions.length === 0) {
      return send_error_response(res, 404, "Data Not Found")
    }
    return res.status(200).json(new api_response(undefined, "Data fetched successfully", suggestions));
  });