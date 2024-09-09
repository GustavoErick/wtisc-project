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

    const body = req.body;

    try {
        const newMinicourse = await prisma.minicourse.create({
            data: {
                ...body
            }
        });

        //res.status(201).json({message: 'Minicurso adicionado com sucesso!'});
        res.status(201).json(newMinicourse);

    } catch (error) {
        
        console.log(error);
        res.status(400).json({message: 'Falha ao adicionar minicurso!'});

    }

}

export const updateMinicourse = async (req, res) => {
    const id = req.params.id;

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

export const presenceMinicourse = async (req, res) => {
    // RESGATA O ID DO USUÁRIO QUE ESTÁ FAZENDO A REQUISIÇÃO
    const tokenUserId = req.userId;
    // ID DO MINICURSO PASSADA NO URL 
    const id = req.params.id;
  
    try {
      // VERIFICA SE O MINICURSO EXISTE NO DB 
      const minicourse = await prisma.minicourse.findUnique({
        where: {
          minicourseId: id
        }
      });
  
      if (!minicourse) {
        return res.status(400).json({message: 'Credenciais inválidas!'});
      }
      
      // VERIFICA SE O USUÁRIO ESTAVA INSCRITO NA PALESTRA
      const minicourseEnrollment = await prisma.minicourseEnrollment.findUnique({
        where: {
          minicourseId_userId: {
            minicourseId: id,
            userId: tokenUserId
          }
        }
      });
  
      if (!minicourseEnrollment) {
        return res.status(401).json({message: 'Você não estava inscrito no minicurso!'});
      }
      
      // ATUALIZA O STATUS DO USUÁRIO COMO PRESENTE NO MINICURSO
      await prisma.minicourseEnrollment.update({
        where: {
          minicourseId_userId: {
            minicourseId: id,
            userId: tokenUserId
          }
        },
        data: {
          status: 'PRESENT'
        }
      });
  
      res.status(200).json({ message: 'Presença confirmada com sucesso!' });

    } catch (error) {

      console.log(error);
      res.status(400).json({ message: 'Falha ao confirmar presença!' });
    
    }

}