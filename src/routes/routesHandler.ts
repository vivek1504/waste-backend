import { Router } from "express";
import { adminHandler } from "./adminRoutes";
import { userHandler } from "./userRoutes";
import { cleanerHandler } from "./cleanerRoutes";
import { v2 as cloudinary } from 'cloudinary';

import multer from "multer";
import path from "path";
import mime from 'mime-types'

export const routesHandler = Router();

routesHandler.use("/admin",adminHandler);
routesHandler.use("/user",userHandler);
routesHandler.use("/cleaner",cleanerHandler);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'dist/uploads/');
    },
    filename: (req, file, cb) => {
      const ext = mime.extension(file.mimetype);
      cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
  });
  
  const upload = multer({ storage: storage });
  
  routesHandler.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
  
    const fileLocation = path.join(__dirname, "uploads", req.file.filename);
    const upload = (async function() {
        cloudinary.config({ 
            cloud_name: 'dj7gqjguy', 
            api_key: '364846129256229', 
            api_secret: '7vYGQuB57AVGM_LHZ3t-r5GbiyA'
        });
        
         const uploadResult = await cloudinary.uploader.upload(fileLocation)
         .then(uploadResult => {
            console.log('Upload Result:', uploadResult.url);
            res.status(200).json({url: uploadResult.url});

         })
         .catch(error => {
            console.error('Upload Error:', error);
            res.status(500).json({message: 'Error uploading file'});
         });   
    })();
  });

  routesHandler.get("/address", async (req, res) => {
    const { lat, lon } = req.query;
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=6257fd3e07dd4faeb12b794a326ef911 `;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  })
