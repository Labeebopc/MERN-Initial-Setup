const { testRegistration } = require("../controllers/testController");

const router = require("express").Router()

//TEST_REGISTRATION || POST
router.post("/api/tests", testRegistration );

//GET_ALL_TESTS || GET
router.get("/api/tests", testRegistration);

//GET_TEST || GET
router.get("/api/tests/:id", testRegistration);

//UPDATE_TEST || PUT
router.put("/api/tests/:id", testRegistration);

//DELETE_TEST || DELETE
router.delete("/api/tests/:id", testRegistration);



module.exports = router;