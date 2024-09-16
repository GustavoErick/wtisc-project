import prisma from '../lib/prisma.js';

export const getLecture = async (req, res) => {

    const id = req.params.id;

    try {
        
        const lecture = await prisma.lecture.findUnique({
            where: {
                lectureId: id,
            }
        });
  
        if (!lecture) {
          res.status(400).json({message: 'Erro ao buscar palestra: Credenciais inválidas!'});
        }
  
        res.status(200).json(lecture);
  
      } catch (error) {
          
          console.log(error);
          res.status(500).json({message: 'Falha ao buscar palestra!'})
  
      }

}

export const getLectures = async (req, res) => {

    try {
        
      const lectures = await prisma.lecture.findMany();

      if (!lectures) {
        res.status(400).json({message: 'Erro ao buscar palestras: Nenhuma palestra cadastrada!'});
      }

      res.status(200).json(lectures);

    } catch (error) {
        
        console.log(error);
        res.status(500).json({message: 'Falha ao buscar palestras!'});

    }
    

}

export const addLecture = async (req, res) => {


    const body = req.body;

    try {
  

        const newLecture = await prisma.lecture.create({
          data: {
            ...body
          }
        });

        res.status(201).json(newLecture);
        //res.status(201).json({message: 'Palestra adicionada com sucesso!'});

    } catch (error) {
        
        console.log(error);
        res.status(400).json({message: 'Falha ao adicionar palestra!'});

    }

}

export const updateLecture = async (req, res) => {
    const id = req.params.id;

    // PEGA TODOS OS INPUTS DA REQUISIÇÃO
    const {... inputs} = req.body;

    try {
        
        const lecture = await prisma.lecture.update({
            where: {
                lectureId: id,
            },

            data: {
                ...inputs,
            }
        });

        if (!lecture) {
            res.status(400).json({message: 'Credenciais inválidas!'});
        }

        res.status(200).json({message: 'Palestra atualizada com sucesso!'});

    } catch (error) {

        console.log(error);
        res.status(500).json({message: 'Falha ao atualizar palestra!'});
        
    }
}

export const deleteLecture = async (req, res) => {

    // VERIFICA SE O USUÁRIO É UM ADMIN
    
    const id = req.params.id;

    try {
        await prisma.lecture.delete({
            where: {
                lectureId: id,
            }
        });

        res.status(200).json({message: 'Palestra deletada com sucesso!'});

    } catch (error) {
        
        console.log(error);
        res.status(400).json({message: 'Falha ao deletar palestra!'});
    }

}


export const presenceLecture = async (req, res) => {
    // RESGATA O ID DO USUÁRIO QUE ESTÁ FAZENDO A REQUISIÇÃO
    const tokenUserId = req.userId;
    // ID DA PALESTRA PASSADA NO URL 
    const id = req.params.id;
  
    try {
      // VERIFICA SE A PALESTRA EXISTE NO DB 
      const lecture = await prisma.lecture.findUnique({
        where: {
          lectureId: id
        }
      });
  
      if (!lecture) {
        return res.status(400).json({ message: 'Credenciais inválidas!' });
      }
      
      // VERIFICA SE O USUÁRIO ESTAVA INSCRITO NA PALESTRA
      const lectureEnrollment = await prisma.lectureEnrollment.findUnique({
        where: {
          lectureId_userId: {
            lectureId: id,
            userId: tokenUserId
          }
        }
      });
  
      if (!lectureEnrollment) {
        return res.status(401).json({ message: 'Você não estava inscrito na palestra!' });
      }
      
      // ATUALIZA O STATUS DO USUÁRIO COMO PRESENTE NA PALESTRA
      await prisma.lectureEnrollment.update({
        where: {
          lectureId_userId: {
            lectureId: id,
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