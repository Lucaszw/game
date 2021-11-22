const fs = require('fs');

const getAllFiles = function(dirPath, parentFolder, arrayOfFiles) {
    const files = fs.readdirSync(dirPath)
  
    arrayOfFiles = arrayOfFiles || []
  
    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, file, arrayOfFiles)
      } else {
        if (parentFolder) arrayOfFiles.push(`${parentFolder}/${file}`);
        if (!parentFolder) arrayOfFiles.push(file);
      }
    })
    return arrayOfFiles
};

const isAuth = function(...roles) {
  return (req, res, next, ...args) => {
    if (!req.user) {
      return res.redirect('/login')
    }

    const hasRole = roles.find(role => req.user.type === role)
    if (!hasRole) {
      throw "User is unauthorized!"
    }

    return next();
  }
}


module.exports = {
    wrap: (fn, shouldSend=true) => {
        // Wrapper to do the following:
        // If no res.json() on calls with shouldSend, auto res.json()
        // If an error occurs asyncronously, pass to an error handler
        return async (req, res, next, ...args) => {
            try {
                const data = await fn(req, res, next, ...args)
                if (!res.headersSent && shouldSend) {res.json(data);}
                return data;
            } catch (error) {
                next(error);
            }
        }
    },
    getAllFiles: getAllFiles,
    isAuth: isAuth
};