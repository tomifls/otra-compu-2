import petModel from "./models/Pet.js";

export default class Pet {

    get = (params) =>{
        return petModel.find(params)
    }

    getBy = (params) =>{
        return petModel.findOne({_id:params});
    }

    getById = (id) =>{
        return petModel.findById(id);
    }

    save = (doc) =>{
        return petModel.create(doc);
    }

    update = (id,doc) =>{
        return petModel.findByIdAndUpdate({_id:id}, {$set: doc}, { new: true });
    }

    delete = (id) =>{
        return petModel.findByIdAndDelete(id);
    }
}