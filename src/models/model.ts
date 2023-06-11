interface Response {
    message: string;
    data: any;
}

export enum action {
    get,
    create,
    update,
    delete,
    other
} 

export const responseBuilder = (action: action, message: string, data?: any): Response => {
    
    switch (action) {
      case 0:
        message = `Successfully retrieved ${message}`;
        break;
      case 1:
        message = `Successfully created ${message}`;
        break;
    case 2:
        message = `Successfully updated ${message}`;
        break;
      case 3:
        message = `Successfully deleted ${message}`;
        break;
      default:
        message = `Action '${message}' completed`;
        break;
    }
  
    return {
      message,
      data: data || {},
    };
  };
  