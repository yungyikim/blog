USER_FIELDS = ['username', 'auth_type', 'email']

def create_user(strategy, details, user=None, *args, **kwargs):
    print(details)
    print(kwargs)
    if user:
        return {'is_new': False}

    fields = {
        'username': details.get('username'),
        'auth_type': 'S',
        'email': details.get('email'),
        'password': ''
    }

    if not fields:
        return

    return {
        'is_new': True,
        'user': strategy.create_user(**fields)
    }
