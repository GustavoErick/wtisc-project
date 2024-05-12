import prisma from "../lib/prisma.js";

export const getProducts = async (req, res) => {

    try {

        const products = await prisma.product.findMany();

        if (!products) {
            res.status(400).json({message: 'Erro ao buscar certificados!'});
        }

        res.status(200).json(products);

    } catch (error) {

        console.log(error);
        res.status(400).json({message: 'Falha ao buscar certificados'});

    }

}

export const getProduct = async (req, res) => {

    const id = req.params.id;

    try {
        
        const product = await prisma.product.findUnique({
            where: {
                productId: id
            }
        });

        if (!product) {
            return res.status(400).json({message: 'Credenciais inválidas!'});
        }

        res.status(200).json(product);

    } catch (error) {
        
        console.log(error);
        res.status(400).json({message: 'Erro ao buscar produto!' });
    }

}

export const addProduct = async (req, res) => {

    const body = req.body;

    try {
        
        const product = await prisma.product.create({
            data: {
                ...body
            }
        });

        res.status(201).json(product);

    } catch (error) {

        console.log(error);
        res.status(400).json({message: 'Falha ao adicionar produto!'});
    }

}

export const updateProduct = async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    try {
        
        const updatedProduct = await prisma.product.update({
            where: {
                productId: id
            },
            data: {
                ...body
            }
        });

        res.status(200).json(updatedProduct);

    } catch (error) {

        console.log(error);
        res.status(400).json({message: 'Erro ao atualizar produto!'});

    }

}

export const deleteProduct = async (req, res) => {

    const id = req.params.id;

    try {
        
        await prisma.product.delete({
            where: {
                productId: id
            }
        });

        res.status(200).json({message: 'Produto deletado com sucesso!'});

    } catch (error) {
        
        console.log(error);
        res.status(400).json({message: 'Falha ao deletar produto!'});

    }
}