// bill-service.js

const generateBill = async () => {
    try {
        const generatedBill = {
            message: "Bill generated successfully",
        };
        return generatedBill;
    } catch (error) {
        throw error;
    }
};

export { generateBill };
