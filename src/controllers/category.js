import Category from "*/models/Category"

export const createCategory = async (req, res) => {
    try {
        const newCat = new Category(req.body)

        const Cat = await newCat.save()

        res.status(200).json(Cat)
    } catch (err) {
        res.status(500).json(err)
    }
}

export const getCategories = async (req,res) => {
    try {
        const categories = await Category.find()

        res.status(200).json(categories)
    } catch (err) {
        res.status(500).json(err)
    }
}