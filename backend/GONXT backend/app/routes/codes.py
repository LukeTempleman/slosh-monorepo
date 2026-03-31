"""Code routes for code generation and verification"""

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.controllers import CodeController
from app.utils.decorators import admin_required

codes_bp = Blueprint("codes", __name__)


@codes_bp.route("/", methods=["POST"])
@jwt_required()
@admin_required
def generate_code():
    """Generate a new random code (admin only)"""
    response, status_code = CodeController.generate_code()
    return jsonify(response), status_code


@codes_bp.route("/verify", methods=["POST"])
@jwt_required()
def verify_code():
    """Verify a hashed code and return the original code"""
    response, status_code = CodeController.verify_code()
    return jsonify(response), status_code


@codes_bp.route("/", methods=["GET"])
@jwt_required()
def list_codes():
    """List all codes (admin sees all, users see their own)"""
    response, status_code = CodeController.list_codes()
    return jsonify(response), status_code


@codes_bp.route("/<code_id>", methods=["GET"])
@jwt_required()
def get_code_details(code_id):
    """Get details of a specific code (admin or owner only)"""
    response, status_code = CodeController.get_code_details(code_id)
    return jsonify(response), status_code


@codes_bp.route("/<code_id>", methods=["DELETE"])
@jwt_required()
def delete_code(code_id):
    """Delete/deactivate a code (admin or owner)"""
    response, status_code = CodeController.delete_code(code_id)
    return jsonify(response), status_code
