const formDataString = (data= {}) => {
        const formData = new URLSearchParams();

        const loopObject = (data, namespace = '') => {
            Object.keys(data).forEach(key => handleField(key, data[key], namespace));
        };

        const loopArray = (data, namespace = '') => {
            data.forEach((value, key) => handleField(key, value, namespace));
        };

        const handleField = (key, data, namespace = '') => {
            let formKey = namespace ? [namespace, "[", key, "]"].join('') : key;

            if (typeof data === "object") {
                if (data.toString() === "[object Object]") {
                    loopObject(data, formKey);
                } else {
                    loopArray(data, formKey);
                }
            } else {
                formData.append(formKey, data);
            }
        };

        loopObject(data);

        return formData;
    };
    
