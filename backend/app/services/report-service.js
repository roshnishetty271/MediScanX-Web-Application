import ReportModel from '../models/report.js';

export const search = async (params = {}) => {
    const reports = await ReportModel.find();
    return reports;
};

export const save = async (newReport) => {
    const report = new ReportModel(newReport);
    return report.save();
};
