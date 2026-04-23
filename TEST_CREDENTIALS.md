# 🔐 TEST CREDENTIALS

Since you're getting 401 Unauthorized, here are the test credentials to use:

## Login Credentials:
- **Email**: admin@test.com
- **Password**: admin123

## To Create More Users:

Run this in backend terminal:
```
python manage.py shell
```

Then paste:
```python
from django.contrib.auth.models import User
User.objects.create_user('newuser', 'newuser@test.com', 'password123')
```

Press Ctrl+D to exit.

## If Login Still Fails:

1. Check backend is running (`python manage.py runserver 8000`)
2. Verify MySQL is running (check Services)
3. Run: `python create_test_user.py`
4. Refresh browser
5. Try login again

## Common Issues:

- **ERR_CONNECTION_REFUSED**: Backend not running
- **401 Unauthorized**: Wrong email/password or user doesn't exist
- **500 Internal Server Error**: Check backend terminal for error message
