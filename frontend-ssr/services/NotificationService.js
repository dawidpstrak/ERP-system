import Vue from 'vue';

class NotificationService {
    static loggedIn() {
        Vue.notify({
            type: 'success',
            title: 'Sign in',
            text: 'You are logged successfully'
        });
    }

    static loggedOut() {
        Vue.notify({
            type: 'success',
            title: 'Sign out',
            text: 'You are logged out'
        });
    }

    static created(thing) {
        Vue.notify({
            type: 'success',
            title: 'Success',
            text: 'Successfully created ' + thing
        });
    }

    static updated(thing) {
        Vue.notify({
            type: 'success',
            title: 'Updated',
            text: 'Successfully updated ' + thing
        });
    }

    static deleted(thing) {
        Vue.notify({
            type: 'success',
            title: 'Deleted',
            text: 'Successfully deleted ' + thing
        });
    }

    static noAccessRights() {
        Vue.notify({
            type: 'error',
            title: 'No access rights',
            text: 'You can edit or delete only pending vacation requests'
        });
    }

    static handleError(error) {
        if (!error.response.status) {
            return;
        }

        switch (error.response.status) {
            case 500:
                Vue.notify({
                    type: 'error',
                    title: 'Server error',
                    text: 'Sorry, error occur on our server, we re working on that ...'
                });

                break;

            case 422:
                Vue.notify({
                    type: 'error',
                    title: error.response.data.title ? error.response.data.title : 'Something went wrong',
                    text: error.response.data.message && error.response.data.message
                });

                break;

            case 404:
                Vue.notify({
                    type: 'error',
                    title: "Resource don't exists",
                    text: error.response.data.message && error.response.data.message
                });

                break;

            case 403:
                Vue.notify({
                    type: 'error',
                    title: 'No access rights',
                    text: 'Access refused, limited permissions'
                });

                break;

            case 401:
                Vue.notify({
                    type: 'error',
                    title: 'Unauthorized',
                    text: error.response.data.message && error.response.data.message
                });

                break;

            default:
                break;
        }
    }
}

export default NotificationService;
