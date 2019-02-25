export default class JsError extends Error {    
    _innerError;
    _aggregateErrors;
    _data;

    constructor(message, innerError, aggregateErrors){
        super(message);
        this._innerError = innerError;
        this._aggregateErrors = aggregateErrors;
        this._data = {};
    }

    innerError() {
        return this._innerError || null;
    }

    aggregateErrors() {
        return this._aggregateErrors || null;
    }

    data() {
        return this._data;
    }

    tryAddData(key, value) {
        try {
            if(!key)
                return false;
            
            if(key.replace(/\s/g, "").length < 1)
                return false;

            if(this._data[key])
                return false;
            
            this._data[key] = value;
            return true;
        } catch(err) {
            console.log("Ocurrió un error al agregar el item al diccionario de datos de errores " + err.toString());
            return false;
        }
    }

    toString() {
        return this.toStringWithData(this, 0);
    }

    toStringWithData(value, tabIndex) {
        let output = '';
        let tabs = "    ".repeat(tabIndex);
        
        //Se anexa el mensaje
        if (tabIndex > 0)
            output = output + tabs + "InnerException: " + value.message + "\n";
        else
            output = output + tabs + "Error: " + value.message + "\n";

        //Se anexa el stacktrace
        if (value.stack && value.stack.replace(/\s/g, "").length>0)
            output = output + "StackTrace:\n" + value.stack.split('\n').slice(1).map(x => tabs + x).join('\n');

        
        if(value instanceof JsError) {
            //Se anexa el data
            if (value.data()) {
                let jsonStringify = JSON.stringify(value.data(), null, "\t");
                let dataLines = jsonStringify.split("\n");
                let dataLinesLen = dataLines.length - 1;
                jsonStringify = dataLines
                    .map((x, i) => {
                        if(i == 0 || i == dataLinesLen)
                            return tabs + x.replace(/\t/g,"");
                        else
                            return tabs + "    " + x.replace(/\t/g,"");
                    })
                    .join("\n");
                let data = "\n" + tabs + "Data: " + jsonStringify;
                output = output + data;
            }

            //Se muestran los errores hijos
            if (value.aggregateErrors && value.aggregateErrors.length > 0) {
                (value.aggregateErrors).forEach(err => {
                    if(err instanceof JsError)
                        output = output + "\n" + err.toStringWithData(err, tabIndex + 1);
                    else
                        output = output + "\n" + this.getStringFromBaseError(err, tabIndex + 1);
                });
            } 
            
            if (value.innerError != null) {
                if(value._innerError && value._innerError instanceof JsError) {
                    var typedInnerError = value.innerError;
                    output = output + "\n" + typedInnerError.toStringWithData(typedInnerError, tabIndex + 1);
                }
                else if(value._innerError) {
                    output = output + "\n" + this.getStringFromBaseError(value._innerError, tabIndex + 1);
                }
            }
        }
        
        return output;
    }

    getStringFromBaseError(err, tabIndex) {
        let tabs = "    ".repeat(tabIndex);
        let output = tabs + "Inner Error: " + err.message;
        
        if(err.stack) {
            output = output + "\n" + tabs + "StackTrace:\n" + err.stack.split("\n")
                .map(x => tabs + x)
                .slice(1)
                .join("\n");
        }

        return output;
    }    
}


