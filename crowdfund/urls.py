# urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# localhost:3000/api 

urlpatterns = [
    path("admin/", admin.site.urls),
    # path("", include("base.urls")),
    path("api/",include("base.api.urls")),
    path("", include("paypal.standard.ipn.urls")),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)