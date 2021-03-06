var catalogueController = require("../controllers/catalogue.controller");

module.exports = function(app) {
  app.get(
    "/catalogue",
    checkAuthenticated,
    catalogueController.getPagedProducts
  );

  app.get(
    "/catalogue/:category_slug/:brand_slug",
    checkAuthenticated,
    catalogueController.getPagedProducts
  );

  /* Create New Product */
  app.all("/new-product", catalogueController.createProduct);

  /* Get Product Detail */
  app.get("/product/:id/detail", catalogueController.getProduct);

  /* Edit Product. */
  app.all("/product/:id/edit", catalogueController.editProduct);

  /* Delete Product. */
  app.all("/product/:id/delete", catalogueController.deleteProduct);

  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect("/login");
  }
};
