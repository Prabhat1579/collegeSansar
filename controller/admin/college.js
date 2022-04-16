const College = require('../../model/College');

const createCollege = (req, res) => {
   try {
      const { name, fee, description, thumbnail } = req.body;

      const college = College.build({ name, fee, description, thumbnail });

      college
         .save()
         .then(() => {
            res.render('admin_college', { collegeCreated: true });
         })
         .catch((err) => {
            throw new Error(err.message);
         });
   } catch (err) {
      res.send(`FAILED: ${err.message}`);
   }
};

module.exports = {
   createCollege,
};
