const cloudinary = require("../utils/cloudinary");
const { isAdmin, isUser, auth } = require("../middleware/auth");
const { Banner } = require("../models/banner");

const router = require("express").Router();

router.post("/", isAdmin, async (req, res) => {
  const { image } = req.body;

  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "ecommerce",
      });

      if (uploadRes) {
        const banner = new Banner({
          image: uploadRes,
        });

        const savedBanner = await banner.save();

        res.status(200).send(savedBanner);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) return res.status(400).send("Product no found...");

    if (banner.image.public_id) {
      const destroyResponse = await cloudinary.uploader.destroy(
        banner.image.public_id
      );

      if (destroyResponse) {
        const deleteBanner = await Banner.findByIdAndDelete(req.params.id);

        res.status(200).send(deleteBanner);
      }
    } else {
      console.log("Action terminated. Failed to deleted product image...");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/', async(req, res) => {
    try{
        const banners = await Banner.find();
        res.status(200).send(banners)
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = router;
