const cleanUser = (user: any) => {
    const { password, _id, __v, ...rest } = user.toObject();

    const cleanedUser: Record<string, any> = {};

    for(const [key ,value] of Object.entries(rest)){
        if(value !== undefined && value !== null && value !== "" && value !== 0) {
            cleanedUser[key] = value;
        }
    }


    return cleanedUser;
}

export { cleanUser };