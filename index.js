import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import { getFiles, uploadFile , getFile, downloadFile, getFileUrl } from './s3.js'
const app = express()

app.use(cookieParser());
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" // agregamos la cabecera Authorization
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send({ status, message });
});
 
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : './tmp'
}));
app.get('/',(req,res)=>{
  res.send({message:"Hola"})
})

app.post('/files', async (req,res)=>{
  // console.log(req.files)
  await uploadFile(req.files.undefined)
  res.send({message:"archivo enviado"})
})

app.get('/files',async(req,res)=>{
  const files = await getFiles()
  res.send(files)
})

app.get('/files/:fileName',async(req,res)=>{
  const file = await getFile(req.params.fileName)
  res.json(file.$metadata)
})

app.get('/file/:fileName',async(req,res)=>{
  const file = await getFileUrl(req.params.fileName)
  res.json(file)
})

app.get('/download/:fileName',async(req,res)=>{
  const file = await downloadFile(req.params.fileName)
  res.json(file)
})

app.listen(3001,()=>{
  console.log('Server on port 3001')
})