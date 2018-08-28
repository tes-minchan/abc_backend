# abc_backend

* ABC Project Backend Server

### A typical top-level directory layout

    .
    └── src                     # 
         ├── config             # App enviroments
         ├── controller         # Server API controller functions
         ├── lib                # Automated tests (alternatively `spec` or `tests`)
         │    ├── API           # Market API functions
         │    ├── ctrlAPI       # Control Market API functions
         │    └── dbquery       # Mysql Query 
         ├── route              # Access point to server
         └── index.js           # App starting point
