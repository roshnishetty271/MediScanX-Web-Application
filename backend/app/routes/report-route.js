import express from 'express'

import * as reportController from '../controllers/report-controller.js'

const router = express.Router()

router.route('/').post(reportController.post)

export default router;