const httpStatus = require('http-status');
const formatErrorResponse = require('../../express/responses/formatError');
const formatSuccessResponse = require('../../express/responses/formatSuccess');
const { NotFound } = require('../../errors');

const update = (req, res) => {
  req.model.findOne({ _id: req.params.id }, '', {}, (err, doc) => {
    if (!doc) {
      return res.status(httpStatus.NOT_FOUND).json(formatErrorResponse(new NotFound(), 'APIError'));
    }

    Object.assign(doc, req.body);

    return doc.save((saveError) => {
      if (saveError) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(formatErrorResponse(saveError, 'mongoose'));
      }

      return res.status(httpStatus.OK).json({
        ...formatSuccessResponse('Updated successfully.', 'message'),
        doc: doc.toJSON({ virtuals: true }),
      });
    });
  });
};

module.exports = update;
