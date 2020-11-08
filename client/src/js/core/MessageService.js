class MessageService {
    static success(message) {
        UIkit.notification({message: message, status: 'success'});
    }

    static error(message) {
        UIkit.notification({message: message, status: 'danger'});
    }
}

export default MessageService;