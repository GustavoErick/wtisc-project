import prisma from '../lib/prisma.js';

export const getMinicourse = async (req, res) => {

    const id = req.params.id;

    try {
        
        const minicourse = await prisma.minicourse.findUnique({
            where: {
                minicourseId: id,
            }
        });
  
        if (!minicourse) {
          res.status(400).json({message: 'Erro ao buscar minicurso: Credenciais inválidas!'});
        }
  
        res.status(200).json(minicourse);
  
      } catch (error) {
          
          console.log(error);
          res.status(500).json({message: 'Falha ao buscar minicurso!'})
  
      }

}

export const getMinicourses = async (req, res) => {

    try {
        
      const minicourses = await prisma.minicourse.findMany();

      if (!minicourses) {
        res.status(400).json({message: 'Erro ao buscar minicursos: Nenhum minicurso cadastrado!'});
      }

      res.status(200).json(minicourses);

    } catch (error) {
        
        console.log(error);
        res.status(500).json({message: 'Falha ao buscar minicursos!'});

    }
    

}

export const addMinicourse = async (req, res) => {

    // VERIFICA SE O USUÁRIO É UM ADMIN

    // RESGATA OS ATRIBUTOS DA REQUISIÇÃO
    // const { 
    //         title, 
    //         description,
    //         prequisites,
    //         instructor,
    //         date,
    //         time,
    //         local,
    //         capacity,
    //         certificateTemplate,
    //     } = req.body;

    const body = req.body;

    try {
        const newMinicourse = await prisma.minicourse.create({
            data: {
                // title, 
                // description,
                // prequisites,
                // instructor,
                // date,
                // time,
                // local,
                // capacity,
                // certificateTemplate,
                ...body
            }
        });

        res.status(201).json({message: 'Minicurso adicionado com sucesso!'});
        //res.status(201).json(newMinicourse);

    } catch (error) {
        
        console.log(error);
        res.status(400).json({message: 'Falha ao adicionar minicurso!'});

    }

}

export const updateMinicourse = async (req, res) => {
    const id = req.params.id;

    // const { 
    //     title, 
    //     description,
    //     prequisites,
    //     instructor,
    //     date,
    //     time,
    //     local,
    //     capacity,
    //     certificateTemplate,
    // } = req.body;

    // PEGA TODOS OS INPUTS DA REQUISIÇÃO
    const {... inputs} = req.body;

    try {
        
        const minicourse = await prisma.minicourse.update({
            where: {
                minicourseId: id,
            },

            data: {
                ...inputs,
            }
        });

        if (!minicourse) {
            res.status(400).json({message: 'Credenciais inválidas!'});
        }

        res.status(200).json({message: 'Minicurso atualizado com sucesso!'});

    } catch (error) {

        console.log(error);
        res.status(500).json({message: 'Falha ao atualizar minicurso!'});
        
    }
}

export const deleteMinicourse = async (req, res) => {
    
    const id = req.params.id;

    try {
        await prisma.minicourse.delete({
            where: {
                minicourseId: id,
            }
        });

        res.status(200).json({message: 'Minicurso deletado com sucesso!'});

    } catch (error) {
        
        console.log(error);
        res.status(400).json({message: 'Falha ao deletar minicurso!'});
    }

}