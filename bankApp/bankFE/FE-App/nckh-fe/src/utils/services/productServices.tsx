import CreateApiService from "../createApiServices";

const api = CreateApiService();

const get = (params: any) => {
    return api.makeAuthRequest({
        url: `/api/v1/collections`,
        method: "GET",
        params: params
    });
};

const getById = (id: Number) => {
    return api.makeAuthRequest({
        url: `/api/v1/product/${id}`,
        method: "GET",
    });
};

const create = (data: any) => {
    return api.makeAuthRequest({
        url: "/api/v1/product",
        method: "POST",
        data: data,
    });
};

const update = (id: Number, data: any) => {
    return api.makeAuthRequest({
        url: `/api/v1/product/${id}`,
        method: "PUT",
        data: data,
    });
};

const deleteById = (id: Number) => {
    return api.makeAuthRequest({
        url: `/api/product/${id}`,
        method: "DELETE",
    });
};

export const productServices = {
    get,
    getById,
    create,
    update,
    deleteById,
};