const College = require('../../model/College');

const createCollege = async (req, res) => {
   try {
      const { name, fee, description, thumbnail } = req.body;

      const college = College.build({ name, fee, description, thumbnail });
      await college.save();

      res.redirect('/admin/college');
   } catch (err) {
      res.send(`FAILED: ${err.message}`);
   }
};

const deleteCollege = async (req, res) => {
   const { college_id } = req.params;
   await College.destroy({
      where: {
         id: college_id,
      },
   });
   res.redirect('/admin/college');
};

module.exports = {
   createCollege,
   deleteCollege,
};
