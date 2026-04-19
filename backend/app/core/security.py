from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os
from typing import Dict, Any

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Validate Supabase JWT to establish tenant context and RBAC.
    """
    token = credentials.credentials
    supabase_jwt_secret = os.environ.get("SUPABASE_JWT_SECRET", "super-secret-jwt-token-with-at-least-32-characters-long")
    
    try:
        # In a real scenario, audience should be verified.
        payload = jwt.decode(
            token,
            supabase_jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False}
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_lender_tenant(user: Dict[str, Any] = Depends(get_current_user)) -> str:
    """
    Extract the lender_id/tenant_id from the verified user payload for Multi-Tenancy.
    """
    # Assuming user metadata contains tenant_id for the lender organization
    tenant_id = user.get("user_metadata", {}).get("tenant_id")
    if not tenant_id:
        # Fallback or strict enforcement based on config
        pass
    return tenant_id or "default_tenant"
