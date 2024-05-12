import prisma from '../lib/prisma.js';


// RETORNA TODAS AS INCRIÇÕES DE PALESTRAS DE TODOS OS USUÁRIOS 
export const getLecuresEnrollment = async (req, res) => {

    try {

        // RESGATA TODAS AS INSCRIÇÕES EM PALESTRAS DO DB
        const lecturesEnrollment = await prisma.lectureEnrollment.findMany();

        if(!lecturesEnrollment) {
            return res.status(400).json({message: 'Nenhuma inscrição em palestras encontrada!'});
        }

        res.status(200).json(lecturesEnrollment);
        
    } catch (error) {

        console.log(error);
        res.status(400).json({message: 'Erro ao buscar palestras incrito!'});

    }
}

// RETORNA UMA INSCRIÇÃO EM PALESTRA ESPECIFICADA POR ID DA INSCRIÇÃO
export const getLecureEnrollment = async (req, res) => {

    const id = req.params.id;

    try {

        const lectureEnrollment = await prisma.lectureEnrollment.findUnique({
            where: {
                enrollmentId: id
            },
            // include: {
            //     user: true
            // }
        });

        if(!lectureEnrollment) {
            return res.status(400).json({message: 'Erro ao buscar incrições: Credenciais inválidas!'});
        }

        res.status(200).json(lectureEnrollment);
        
    } catch (error) {

        console.log(error);
        res.status(400).json({message: 'Erro ao buscar inscrição na palestra!'});

    }

}

// CRIA UMA INCRIÇÃO EM UMA PALESTRA // INSCREVE O USUÁRIO QUE FEZ A REQUISIÇÃO EM UMA PALESTRA
export const addLecureEnrollment = async (req, res) => {

    const { lectureId } = req.body;

    const tokenUserId = req.userId;

    try {

        const lecture = await prisma.lecture.findUnique({
            where: {
                lectureId: lectureId
            }
        });

        if (!lecture) {
            return res.status(400).json({message: 'Palestra inexistente!'});
        }

        //VERIFICA SE AINDA HÁ VAGAS NO MINICURSO
        if (!(lecture.enrolled < lecture.capacity)) {
            return res.status().json({message: 'Limite de inscrições no minicurso atingido!'});
        }

        const newLectureEnrollment = await prisma.lectureEnrollment.create({
            data: {
                lectureId: lectureId,
                userId: tokenUserId
            }
        });

        await prisma.lecture.update({
            where: {
                lectureId: lectureId
            },
            data: {
                enrolled: { increment: 1 }
            }
        });

        //res.status(201).json({message: 'Inscrição no minicurso realizada com sucesso!'});
        res.status(201).json(newLectureEnrollment);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Falha ao se inscrever na palestra!'});
    }

    // const tokenUserId = req.userId;
    // const lectureId = req.params.lectureId;

    // // BUSCA A PALESTRA DA REQUISIÇÃO NO BANCO DE DADOS 
    // try {
    //     const lecture = await prisma.lecture.findUnique({
    //         where: {
    //             lectureId: lectureId
    //         }
    //     });

    //     if (!lecture) {
    //         return res.status(400).json({message: 'Credenciais inválidas!'});
    //     }

    //     // VERIFICA SE AINDA HÁ VAGAS NA PALESTRA
    //     if (!(lecture.enrolled < lecture.capacity)) {
    //         return res.status().json({message: 'Limite de inscrições na palestra atingido!'});
    //     }

    //     const newLectureEnrollment = await prisma.lectureEnrollment.create({
    //         data: {
    //             lectureId: lecture.lectureId,
    //             userId: tokenUserId
    //         }
    //     });
 
    //     await prisma.lecture.update({
    //         where: {
    //             lectureId: lectureId
    //         },
    //         data: {
    //             //enrolled: lecture.enrolled + 1
    //             enrolled: { increment: 1 }
    //         }
    //     });

    //     res.status(200).json(newLectureEnrollment);

    // } catch (error) {
    //     console.log(error);
    //     res.status(400).json({message: 'Falha ao se inscrever na palestra!'});
    // }

    // const body = req.body;
    // const tokenUserId = req.userId;

//     try {
//         const newLectureEnrollment = await prisma.lectureEnrollment.create({
//             data: {
//                 ...body,
//                 userId: tokenUserId
//             }
//         });

//         res.status(200).json(newLectureEnrollment);

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({message: 'Fala ao se inscrever na palestra!'});
//     }
}

export const updateLectureEnrollment = async (req, res) => {

    // ID DA URL
    const id = req.params.id;
    // ID DO USUÁRIO QUE ESTÁ FAZENDO A REQUISIÇÃO
    const tokenUserId = req.userId;
    // CORPO DA REQUISIÇÃO COM TODAS AS ALTERAÇÕES
    const body = req.body;

    try {

        const updateLectureEnrollment = await prisma.lectureEnrollment.update({
            where: {
                enrollmentId: id,
                userId: tokenUserId
            },
            data: {
                ...body
            }
        });

        if(!updateLectureEnrollment) {
            return res.status(400).json({message: 'Erro ao atualizar incrição: Credenciais inválidas!'});
        }

        res.status(200).json(updateLectureEnrollment);
        
    } catch (error) {

        console.log(error);
        res.status(400).json({message: 'Erro ao atualizar inscrição na palestra!'});

    }

}

export const deleteLectureEnrollment = async (req, res) => {
    
    const id = req.params.id;
    const tokenUserId = req.userId;

    try {
        const lectureEnrollment = await prisma.lectureEnrollment.findUnique({
            where: {
                enrollmentId: id,
                userId: tokenUserId
            }
        });

        if (!lectureEnrollment) {
            return res.status(400).json({message: 'Credenciais inválidas!'});
        }

        const lectureId = lectureEnrollment.lectureId;

        await prisma.lectureEnrollment.delete({
            where: {
                enrollmentId: id
            }
        });

        await prisma.lecture.update({
            where: {
                lectureId: lectureId
            },
            data: {
                enrolled: { increment: -1 }
            }
        });

        res.status(200).json({message: 'Inscrição deletada com sucesso!'});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Falha ao deletar inscrição!'});
    }

    // // ID DA URL
    // const id = req.params.id;
    // // ID DO USUÁRIO QUE ESTÁ FAZENDO A REQUISIÇÃO
    // const tokenUserId = req.userId;

    // try {

    //     const lectureEnrollment = await prisma.lectureEnrollment.findUnique({
    //         where: {
    //             enrollmentId: id,
    //             userId: tokenUserId
    //         }
    //     });

    //     // VERIFICA SE O USUÁRIO QUE ESTÁ TENTANDO DELETAR É O USUÁRIO DA INSCRIÇÃO
    //     // if (lectureEnrollment.userId !== tokenUserId) {
    //     //     return res.status(403).json({message: 'Usuário não autorizado!'});
    //     // }

    //     if (!lectureEnrollment) {
    //         return res.status(400).json({message: 'Credenciais inválidas!'});
    //     }
        
    //     const lectureId = lectureEnrollment.lectureId;

    //     await prisma.lectureEnrollment.delete({
    //         where: {
    //             enrollmentId: id,
    //             userId: tokenUserId
    //         }
    //     });

    //     //console.log(lectureId);
    //     await prisma.lecture.update({
    //         where: {
    //             lectureId: lectureId
    //         },

    //         data: {
    //             enrolled: { increment: -1 }
    //         }
    //     });

    //     res.status(200).json({message: 'Inscrição na palestra deletada com sucesso!'});
        
    // } catch (error) {

    //     console.log(error);
    //     res.status(400).json({message: 'Erro ao deletar inscrição na palestra!'});

    // }
}

// ATUALIZA O STATUS DA INSCRIÇÃO NA PALESTRA POSSIBILITANDO A EMISSAO DO CERTIFICADO
export const setStatusLectureEnrollment = async (req, res) => {
    // RESGATA O ID DO URL, SENDO ESTE UM ID DE UMA PALESTRA E NÃO DE UMA INSCRIÇÃO NA PALESTRA
    const lectureId = req.params.id;
    // ID DO USUÁRIO DA REQUISIÇÃO
    const tokenUserId = req.userId;

    // BUSCA A PALESTRA NO DB
    try {
        const lecture = await prisma.lecture.findUnique({
            where: {
                lectureId: lectureId,
            }
        });

        // VERIFICA SE LECTURE É UNDEFINED OU NULL
        if (!lecture) {
            return res.status(400).json({message: 'Erro nas credenciais fornecidas!'});
        }

        // VERIFICA SE O USUÁRIO ESTÁ INSCRITO NA PALESTRA 
        const lectureEnrollment = await prisma.lectureEnrollment.findUnique({
            where: {
                lectureId: lectureId,
                userId: tokenUserId
            }
        });

        // VERIFICA SE O ID DA REQUISICAO É IGUAL AO DA INSCRICÃO
        // if(lectureEnrollment.userId !== tokenUserId) {
        //     res.status(403).json({message: 'Usuário não autorizado!'});
        // }

        if (!lectureEnrollment) {
            res.status(403).json({message: 'Erro: Você não estava inscrito na palestra!'});
        }

        // ATUALIZA A PRESENÇA DO USUÁRIO
        await prisma.lectureEnrollment.update({
            where: {
                enrollmentId: lectureEnrollment.enrollmentId
            },
            data: {
                status: 'PRESENT'
            }
        });

        res.status(200).json({message: 'Presença confirmada com sucesso!'});
    

    } catch (error) {

        console.log(error);
        res.status(400).json({message: 'Erro ao registrar presença!'});

    }

}

// RETORNA TODAS AS INSCRIÇÕES EM MINICURSOS DE TODOS OS USUÁRIOS
export const getMinicoursesEnrollment = async (req, res) => {

    try {

        // RESGATA TODAS AS INSCRIÇÕES EM MINICURSOS DO DB
        const minicoursesEnrollment = await prisma.minicourseEnrollment.findMany();

        if(!minicoursesEnrollment) {
            return res.status(400).json({message: 'Nenhuma inscrição em minicursos encontrada!'});
        }

        res.status(200).json(minicoursesEnrollment);
        
    } catch (error) {

        console.log(error);
        res.status(400).json({message: 'Erro ao buscar minicursos incrito!'});

    }
}

// RETORNA UMA INCRIÇÃO EM UM MINICURSO ESPECIFICADO POR ID DA INSCRIÇÃO
export const getMinicourseEnrollment = async (req, res) => {

    const id = req.params.id;

    try {

        const minicourseEnrollment = await prisma.minicourseEnrollment.findUnique({
            where: {
                enrollmentId: id
            }
        });

        if(!minicourseEnrollment) {
            return res.status(400).json({message: 'Erro ao buscar incrições: Credenciais inválidas!'});
        }

        res.status(200).json(minicourseEnrollment);
        
    } catch (error) {

        console.log(error);
        res.status(400).json({message: 'Erro ao buscar inscrição no minicurso!'});

    }
}

// CRIA UMA INCRIÇÃO EM UM MINICURSO // INSCREVE O USUÁRIO QUE FEZ A REQUISIÇÃO EM UM MINICURSO
export const addMinicourseEnrollment = async (req, res) => {
    
    // // BUSCA A PALESTRA DA REQUISIÇÃO NO BANCO DE DADOS 
    // try {
    //     const lecture = await prisma.lecture.findUnique({
    //         where: {
    //             lectureId: lectureId
    //         }
    //     });

    //     if (!lecture) {
    //         return res.status(400).json({message: 'Credenciais inválidas!'});
    //     }

    //     // VERIFICA SE AINDA HÁ VAGAS NA PALESTRA
    //     if (!(lecture.enrolled < lecture.capacity)) {
    //         return res.status().json({message: 'Limite de inscrições na palestra atingido!'});
    //     }

    //     const newLectureEnrollment = await prisma.lectureEnrollment.create({
    //         data: {
    //             lectureId: lecture.lectureId,
    //             userId: tokenUserId
    //         }
    //     });
 
    //     await prisma.lecture.update({
    //         where: {
    //             lectureId: lectureId
    //         },
    //         data: {
    //             //enrolled: lecture.enrolled + 1
    //             enrolled: { increment: 1 }
    //         }
    //     });
    
    const { minicourseId } = req.body;

    const tokenUserId = req.userId;

    try {

        const minicourse = await prisma.minicourse.findUnique({
            where: {
                minicourseId: minicourseId
            }
        });

        if (!minicourse) {
            return res.status(400).json({message: 'Minicurso inexistente'});
        }

        //VERIFICA SE AINDA HÁ VAGAS NO MINICURSO
        if (!(minicourse.enrolled < minicourse.capacity)) {
            return res.status().json({message: 'Limite de inscrições no minicurso atingido!'});
        }

        const newMinicourseEnrollment = await prisma.minicourseEnrollment.create({
            data: {
                minicourseId: minicourseId,
                userId: tokenUserId
            }
        });

        await prisma.minicourse.update({
            where: {
                minicourseId: minicourseId
            },
            data: {
                enrolled: { increment: 1 }
            }
        });

        //res.status(201).json({message: 'Inscrição no minicurso realizada com sucesso!'});
        res.status(201).json(newMinicourseEnrollment);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Falha ao se inscrever no minicurso!'});
    }
    


    //const body = req.body;
    //const minicourseId = req.params.minicourseId;
    
    // const tokenUserId = req.userId;

    // try {
    //     const newMinicourseEnrollment = await prisma.minicourseEnrollment.create({
    //         data: {
    //             ...body,
    //             userId: tokenUserId
    //         }
    //     });

    //     res.status(200).json(newMinicourseEnrollment);

    // } catch (error) {
    //     console.log(error);
    //     res.status(500).json({message: 'Falha ao se inscrever no minicurso!'});
    // }
}

export const updateMinicourseEnrollment = async (req, res) => {

    // ID DA URL
    const id = req.params.id;
    // ID DO USUÁRIO QUE ESTÁ FAZENDO A REQUISIÇÃO
    const tokenUserId = req.userId;
    // CORPO DA REQUISIÇÃO COM TODAS AS ALTERAÇÕES
    const body = req.body;

    try {

        // RESGATA A INSCRIÇÃO ATRAVÉS DO ID
        const minicourseEnrollment = await prisma.minicourseEnrollment.findUnique({
            where: {
                enrollmentId: id
            }
        });

        if(!minicourseEnrollment) {
            return res.status(400).json({message: 'Erro ao atualizar incrição: Credenciais inválidas!'});
        }

        // VERIFICA SE O USUÁRIO QUE ESTÁ TENTANDO DELETAR É O USUÁRIO DA INSCRIÇÃO
        if (minicourseEnrollment.userId !== tokenUserId) {
            return res.status(403).json({message: 'Usuário não autorizado!'});
        }

        const updatedMinicourseEnrollment = await prisma.minicourseEnrollment.update({
            where: {
                enrollmentId: id,
                userId: tokenUserId
            },
            data: {
                ...body
            }
        });

        res.status(200).json(updatedMinicourseEnrollment);
        
    } catch (error) {

        console.log(error);
        res.status(400).json({message: 'Erro ao atualizar inscrição no minicurso!'});

    }
}

export const deleteMinicourseEnrollment = async (req, res) => {
    
    // ID DA URL
    const id = req.params.id;
    // ID DO USUÁRIO QUE ESTÁ FAZENDO A REQUISIÇÃO
    const tokenUserId = req.userId;

    try {
        
        // RESGATA A INSCRIÇÃO ATRAVÉS DO ID
        const minicourseEnrollment = await prisma.minicourseEnrollment.findUnique({
            where: {
                enrollmentId: id
            }
        });


        // VERIFICA SE O USUÁRIO QUE ESTÁ TENTANDO DELETAR É O USUÁRIO DA INSCRIÇÃO
        if (minicourseEnrollment.userId !== tokenUserId) {
            return res.status(403).json({message: 'Usuário não autorizado!'});
        }

        const minicourseId = minicourseEnrollment.minicourseId;

        // const minicourse = await prisma.minicourse.findUnique({
        //     where: {
        //         minicourseId: minicourseId
        //     }
        // });

        await prisma.minicourse.update({
            where: {
                minicourseId: minicourseId
            }, 

            data: {
                enrolled: { increment: -1 }
            }
        });

        // DELETA A INSCRIÇÃO PELO ID 
        await prisma.minicourseEnrollment.delete({
            where: {
                enrollmentId: id,
            }
        });
        
        // await prisma.minicourseEnrollment.delete({
        //     where: {
        //         enrollmentId: id,
        //         userId: tokenUserId
        //     }
        // });

        res.status(200).json({message: 'Inscrição no minicurso deletada com sucesso!'});
        
    } catch (error) {

        console.log(error);
        res.status(400).json({message: 'Erro ao deletar inscrição no minicurso!'});

    }

}