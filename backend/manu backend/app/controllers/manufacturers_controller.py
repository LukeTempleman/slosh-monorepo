"""Manufacturers controller for product and batch management"""

from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from app import db
from app.models import User, Batch, BatchStatus, RiskLevel, Scan
from datetime import datetime, timedelta
import random

class ManufacturersController:
    """Controller for manufacturer data management"""
    
    @staticmethod
    def get_dashboard_stats():
        """Get dashboard overview statistics"""
        try:
            # Mock data - in production this would come from database
            stats = {
                "totalProducts": 847200,
                "authenticatedScans": 324568,
                "counterfeitDetected": 1247,
                "riskScore": 7.2,
                "systemHealth": 98.7,
                "threatLevel": "ELEVATED",
                "activeInvestigations": 23,
                "blockedProducts": 156,
                "suspiciousLocations": 34,
                "networkThreats": 12
            }
            return jsonify(stats), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @staticmethod
    def get_batch_data():
        """Get batch management data"""
        try:
            batches = [
                {
                    "id": "BN001",
                    "product": "Jameson Irish Whiskey",
                    "quantity": 5000,
                    "status": "In Transit",
                    "location": "Johannesburg",
                    "lastUpdate": datetime.utcnow().isoformat(),
                    "scans": 234,
                    "successRate": 98.5
                },
                {
                    "id": "BN002",
                    "product": "Chivas Regal 12 Year",
                    "quantity": 3200,
                    "status": "In Distribution",
                    "location": "Cape Town",
                    "lastUpdate": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                    "scans": 156,
                    "successRate": 97.2
                },
                {
                    "id": "BN003",
                    "product": "Absolut Vodka",
                    "quantity": 7800,
                    "status": "Stored",
                    "location": "Durban",
                    "lastUpdate": (datetime.utcnow() - timedelta(days=1)).isoformat(),
                    "scans": 98,
                    "successRate": 100
                }
            ]
            return jsonify(batches), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @staticmethod
    def get_filtered_batches(status=None, created_at_from=None, created_at_to=None, 
                            quality_score_min=None, quality_score_max=None, 
                            risk_level=None, limit=100, offset=0):
        """Get filtered batches from database
        
        Args:
            status: Filter by batch status (pending, production, completed, rejected)
            created_at_from: Filter batches created from this date (ISO format)
            created_at_to: Filter batches created to this date (ISO format)
            quality_score_min: Minimum quality score
            quality_score_max: Maximum quality score
            risk_level: Filter by risk level (low, medium, high)
            limit: Number of results to return
            offset: Pagination offset
        
        Returns:
            JSON response with filtered batches and metadata
        """
        try:
            from app.models import Batch
            
            # Start with base query
            query = Batch.query
            
            # Apply filters
            if status:
                valid_statuses = ['pending', 'production', 'completed', 'rejected']
                if status.lower() in valid_statuses:
                    query = query.filter_by(status=status.lower())
                else:
                    return jsonify({"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}), 400
            
            if created_at_from:
                try:
                    from_date = datetime.fromisoformat(created_at_from)
                    query = query.filter(Batch.created_at >= from_date)
                except ValueError:
                    return jsonify({"error": "Invalid created_at_from format. Use ISO format (YYYY-MM-DD)"}), 400
            
            if created_at_to:
                try:
                    to_date = datetime.fromisoformat(created_at_to)
                    # Add 1 day to include the entire day
                    to_date = to_date + timedelta(days=1)
                    query = query.filter(Batch.created_at < to_date)
                except ValueError:
                    return jsonify({"error": "Invalid created_at_to format. Use ISO format (YYYY-MM-DD)"}), 400
            
            if quality_score_min is not None:
                if 0 <= quality_score_min <= 100:
                    query = query.filter(Batch.quality_score >= quality_score_min)
                else:
                    return jsonify({"error": "quality_score_min must be between 0 and 100"}), 400
            
            if quality_score_max is not None:
                if 0 <= quality_score_max <= 100:
                    query = query.filter(Batch.quality_score <= quality_score_max)
                else:
                    return jsonify({"error": "quality_score_max must be between 0 and 100"}), 400
            
            if risk_level:
                valid_risk_levels = ['low', 'medium', 'high']
                if risk_level.lower() in valid_risk_levels:
                    query = query.filter_by(risk_level=risk_level.lower())
                else:
                    return jsonify({"error": f"Invalid risk_level. Must be one of: {', '.join(valid_risk_levels)}"}), 400
            
            # Get total count before pagination
            total_count = query.count()
            
            # Apply sorting and pagination
            query = query.order_by(Batch.created_at.desc())
            query = query.limit(limit).offset(offset)
            
            # Fetch results
            batches = query.all()
            
            # Format response
            response = {
                "data": [batch.to_dict() for batch in batches],
                "pagination": {
                    "total": total_count,
                    "limit": limit,
                    "offset": offset,
                    "returned": len(batches)
                },
                "filters_applied": {
                    "status": status,
                    "created_at_from": created_at_from,
                    "created_at_to": created_at_to,
                    "quality_score_min": quality_score_min,
                    "quality_score_max": quality_score_max,
                    "risk_level": risk_level
                }
            }
            
            return jsonify(response), 200
        
        except Exception as e:
            return jsonify({"error": f"Error retrieving batches: {str(e)}"}), 500
    
    @staticmethod
    def get_batch(batch_id):
        """Get a single batch by ID
        
        Args:
            batch_id: The batch ID (e.g., BN0001)
        
        Returns:
            JSON response with batch details or error
        """
        try:
            from app.models import Batch
            
            # Validate batch_id format
            if not batch_id or not isinstance(batch_id, str):
                return jsonify({"error": "Invalid batch ID format"}), 400
            
            # Query for the batch
            batch = Batch.query.filter_by(id=batch_id.upper()).first()
            
            if not batch:
                return jsonify({"error": f"Batch {batch_id} not found"}), 404
            
            # Return batch details
            return jsonify({
                "message": "Batch retrieved successfully",
                "batch": batch.to_dict()
            }), 200
        
        except Exception as e:
            return jsonify({"error": f"Error retrieving batch: {str(e)}"}), 500
    
    @staticmethod
    def update_batch(batch_id, request):
        """Update batch details (status, quality score, risk level, notes)
        
        Args:
            batch_id: The batch ID (e.g., BN0001)
            request: Flask request object with JSON body
        
        Returns:
            JSON response with updated batch or error
        """
        try:
            from app.models import Batch, BatchStatus
            
            # Validate batch_id format
            if not batch_id or not isinstance(batch_id, str):
                return jsonify({"error": "Invalid batch ID format"}), 400
            
            # Parse JSON request body
            data = request.get_json()
            if not data:
                return jsonify({"error": "Request body must be JSON"}), 400
            
            # Query for the batch
            batch = Batch.query.filter_by(id=batch_id.upper()).first()
            if not batch:
                return jsonify({"error": f"Batch {batch_id} not found"}), 404
            
            # Update status if provided
            if 'status' in data and data['status'] is not None:
                new_status = data['status'].lower()
                valid_statuses = ['pending', 'production', 'completed', 'rejected']
                
                if new_status not in valid_statuses:
                    return jsonify({"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}), 400
                
                # Check valid status transitions
                current_status = batch.status
                valid_transitions = {
                    'pending': ['production', 'rejected'],
                    'production': ['completed', 'rejected'],
                    'completed': [],
                    'rejected': []
                }
                
                if new_status not in valid_transitions.get(current_status, []):
                    if new_status == current_status:
                        return jsonify({"error": f"Batch is already in {current_status} status"}), 400
                    else:
                        return jsonify({"error": f"Cannot transition from {current_status} to {new_status}. Valid transitions: {', '.join(valid_transitions.get(current_status, []))}"}), 400
                
                batch.status = new_status
            
            # Update quality_score if provided
            if 'quality_score' in data and data['quality_score'] is not None:
                try:
                    quality_score = float(data['quality_score'])
                    if not (0 <= quality_score <= 100):
                        return jsonify({"error": "quality_score must be between 0 and 100"}), 400
                    batch.quality_score = quality_score
                except (ValueError, TypeError):
                    return jsonify({"error": "quality_score must be a valid number"}), 400
            
            # Update risk_level if provided
            if 'risk_level' in data and data['risk_level'] is not None:
                risk_level = data['risk_level'].lower()
                valid_risk_levels = ['low', 'medium', 'high']
                
                if risk_level not in valid_risk_levels:
                    return jsonify({"error": f"Invalid risk_level. Must be one of: {', '.join(valid_risk_levels)}"}), 400
                
                batch.risk_level = risk_level
            
            # Update notes if provided
            if 'notes' in data and data['notes'] is not None:
                notes = data['notes'].strip()
                if len(notes) > 1000:
                    return jsonify({"error": "notes must not exceed 1000 characters"}), 400
                batch.notes = notes if notes else None
            
            # Update timestamp
            batch.updated_at = datetime.utcnow()
            
            # Save changes
            db.session.commit()
            
            return jsonify({
                "message": "Batch updated successfully",
                "batch": batch.to_dict()
            }), 200
        
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Error updating batch: {str(e)}"}), 500
    
    @staticmethod
    def create_batch(request):
        """Create a new batch
        
        Args:
            request: Flask request object with JSON body
        
        Returns:
            JSON response with created batch or error
        """
        try:
            # Get current user ID from JWT token
            user_id = get_jwt_identity()
            
            # Parse JSON request body
            data = request.get_json()
            
            if not data:
                return jsonify({"error": "Request body must be JSON"}), 400
            
            # Validate required fields
            product_name = data.get('product_name', '').strip()
            quantity = data.get('quantity')
            
            # Validation: product_name
            if not product_name:
                return jsonify({"error": "product_name is required and cannot be empty"}), 400
            if len(product_name) > 255:
                return jsonify({"error": "product_name must not exceed 255 characters"}), 400
            
            # Validation: quantity
            if quantity is None:
                return jsonify({"error": "quantity is required"}), 400
            try:
                quantity = int(quantity)
                if quantity <= 0:
                    return jsonify({"error": "quantity must be a positive integer"}), 400
            except (ValueError, TypeError):
                return jsonify({"error": "quantity must be a valid integer"}), 400
            
            # Optional fields with defaults
            location = data.get('location', '').strip() or None
            if location and len(location) > 255:
                return jsonify({"error": "location must not exceed 255 characters"}), 400
            
            quality_score = data.get('quality_score', 0)
            try:
                quality_score = float(quality_score)
                if not (0 <= quality_score <= 100):
                    return jsonify({"error": "quality_score must be between 0 and 100"}), 400
            except (ValueError, TypeError):
                return jsonify({"error": "quality_score must be a valid number between 0 and 100"}), 400
            
            risk_level = data.get('risk_level', 'low').lower()
            valid_risk_levels = ['low', 'medium', 'high']
            if risk_level not in valid_risk_levels:
                return jsonify({"error": f"risk_level must be one of: {', '.join(valid_risk_levels)}"}), 400
            
            notes = data.get('notes', '').strip() or None
            if notes and len(notes) > 1000:
                return jsonify({"error": "notes must not exceed 1000 characters"}), 400
            
            # Generate batch ID (BN format with auto-increment)
            last_batch = Batch.query.order_by(Batch.id.desc()).first()
            if last_batch:
                # Extract number from last batch ID and increment
                last_num = int(last_batch.id.replace('BN', ''))
                batch_id = f"BN{str(last_num + 1).zfill(4)}"
            else:
                batch_id = "BN0001"
            
            # Create batch with status = pending and link to current user
            batch = Batch(
                id=batch_id,
                product_name=product_name,
                quantity=quantity,
                status=BatchStatus.PENDING.value,  # Always pending on creation
                quality_score=quality_score,
                risk_level=risk_level,
                location=location,
                created_by=user_id,
                notes=notes,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            # Save to database
            db.session.add(batch)
            db.session.commit()
            
            return jsonify({
                "message": "Batch created successfully",
                "batch": batch.to_dict()
            }), 201
        
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Error creating batch: {str(e)}"}), 500
    
    @staticmethod
    def delete_batch(batch_id, request):
        """Delete a batch (soft or hard delete)
        
        Args:
            batch_id: The batch ID (e.g., BN0001)
            request: Flask request object with optional JSON body
        
        Query Parameters:
            hard_delete: Set to 'true' for hard delete (permanent removal).
                        Default: false (soft delete only marks as deleted)
        
        Returns:
            JSON response confirming deletion or error
        """
        try:
            from app.models import Batch
            
            # Validate batch_id format
            if not batch_id or not isinstance(batch_id, str):
                return jsonify({"error": "Invalid batch ID format"}), 400
            
            # Query for the batch
            batch = Batch.query.filter_by(id=batch_id.upper()).first()
            if not batch:
                return jsonify({"error": f"Batch {batch_id} not found"}), 404
            
            # Check if already deleted
            if batch.deleted_at is not None:
                return jsonify({"error": f"Batch {batch_id} has already been deleted"}), 410
            
            # Check if hard delete is requested
            hard_delete = request.args.get('hard_delete', 'false').lower() == 'true'
            
            if hard_delete:
                # Hard delete: actually remove from database
                # In a production system, you might want to:
                # 1. Delete related NFC tags
                # 2. Archive audit trail
                # 3. Backup batch data
                db.session.delete(batch)
                db.session.commit()
                
                return jsonify({
                    "message": f"Batch {batch_id} permanently deleted",
                    "delete_type": "hard"
                }), 200
            else:
                # Soft delete: mark as deleted with timestamp
                batch.deleted_at = datetime.utcnow()
                batch.updated_at = datetime.utcnow()
                db.session.commit()
                
                return jsonify({
                    "message": f"Batch {batch_id} marked as deleted",
                    "delete_type": "soft",
                    "batch": batch.to_dict()
                }), 200
        
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Error deleting batch: {str(e)}"}), 500
    
    @staticmethod
    def get_batch_metrics():
        """Get aggregate KPIs for batches
        
        Returns:
            JSON response with metrics:
            - total: total number of batches (including soft-deleted)
            - active: batches in pending or production status
            - completed: batches with completed status
            - rejected: batches with rejected status
            - avg_quality: average quality score across all batches
            - by_status: breakdown of batches by status
            - by_risk: breakdown of batches by risk level
        """
        try:
            from app.models import Batch, BatchStatus, RiskLevel
            from sqlalchemy import func
            
            # Query all non-deleted batches
            active_query = Batch.query.filter(Batch.deleted_at.is_(None))
            
            # Total count
            total = active_query.count()
            
            # Count by status
            pending_count = active_query.filter_by(status=BatchStatus.PENDING).count()
            production_count = active_query.filter_by(status=BatchStatus.PRODUCTION).count()
            completed_count = active_query.filter_by(status=BatchStatus.COMPLETED).count()
            rejected_count = active_query.filter_by(status=BatchStatus.REJECTED).count()
            
            # Active batches (pending + production)
            active_count = pending_count + production_count
            
            # Average quality score
            avg_quality = active_query.with_entities(func.avg(Batch.quality_score)).scalar() or 0
            avg_quality = float(avg_quality)
            
            # Count by risk level
            low_risk = active_query.filter_by(risk_level=RiskLevel.LOW).count()
            medium_risk = active_query.filter_by(risk_level=RiskLevel.MEDIUM).count()
            high_risk = active_query.filter_by(risk_level=RiskLevel.HIGH).count()
            
            # Calculate quality score ranges
            excellent = active_query.filter(Batch.quality_score >= 90).count()
            good = active_query.filter(Batch.quality_score >= 75, Batch.quality_score < 90).count()
            fair = active_query.filter(Batch.quality_score >= 60, Batch.quality_score < 75).count()
            poor = active_query.filter(Batch.quality_score < 60).count()
            
            metrics = {
                "summary": {
                    "total": total,
                    "active": active_count,
                    "completed": completed_count,
                    "rejected": rejected_count,
                    "avg_quality": round(avg_quality, 2)
                },
                "by_status": {
                    "pending": pending_count,
                    "production": production_count,
                    "completed": completed_count,
                    "rejected": rejected_count
                },
                "by_risk": {
                    "low": low_risk,
                    "medium": medium_risk,
                    "high": high_risk
                },
                "quality_distribution": {
                    "excellent": excellent,  # >= 90
                    "good": good,             # 75-90
                    "fair": fair,             # 60-75
                    "poor": poor              # < 60
                }
            }
            
            return jsonify({
                "message": "Metrics retrieved successfully",
                "metrics": metrics
            }), 200
        
        except Exception as e:
            return jsonify({"error": f"Error retrieving metrics: {str(e)}"}), 500
    
    @staticmethod
    def get_analytics():
        """Get brand and regional analytics"""
        try:
            analytics = {
                "brands": [
                    {
                        "id": "jameson",
                        "name": "Jameson Irish Whiskey",
                        "totalScans": 48200,
                        "authenticatedScans": 47500,
                        "successRate": 98.5,
                        "monthlyGrowth": 12.5,
                        "region": "South Africa",
                        "topMarkets": ["Johannesburg", "Cape Town", "Durban"],
                        "riskLevel": "Low"
                    },
                    {
                        "id": "chivas",
                        "name": "Chivas Regal 12 Year",
                        "totalScans": 39100,
                        "authenticatedScans": 37900,
                        "successRate": 97.0,
                        "monthlyGrowth": 8.3,
                        "region": "South Africa",
                        "topMarkets": ["Johannesburg", "Pretoria"],
                        "riskLevel": "Medium"
                    },
                    {
                        "id": "absolut",
                        "name": "Absolut Vodka",
                        "totalScans": 62400,
                        "authenticatedScans": 60200,
                        "successRate": 96.5,
                        "monthlyGrowth": 6.7,
                        "region": "South Africa",
                        "topMarkets": ["Cape Town", "Johannesburg"],
                        "riskLevel": "Medium"
                    }
                ],
                "regional": [
                    {
                        "region": "Gauteng",
                        "products": 235000,
                        "scans": 89500,
                        "successRate": 98.2,
                        "activeRetailers": 234,
                        "compliance": 98.2
                    },
                    {
                        "region": "Western Cape",
                        "products": 198000,
                        "scans": 78200,
                        "successRate": 97.9,
                        "activeRetailers": 189,
                        "compliance": 97.9
                    },
                    {
                        "region": "KwaZulu-Natal",
                        "products": 156000,
                        "scans": 62400,
                        "successRate": 96.8,
                        "activeRetailers": 145,
                        "compliance": 96.8
                    }
                ]
            }
            return jsonify(analytics), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @staticmethod
    def get_reports():
        """Get compliance and risk reports"""
        try:
            reports = {
                "monthlyReport": {
                    "month": "September 2024",
                    "totalScans": 324568,
                    "counterfeitDetected": 1247,
                    "alertsGenerated": 234,
                    "investigationsOpened": 23,
                    "prosecutionsCases": 7,
                    "revenueProtected": 428000000
                },
                "riskAnalysis": {
                    "highRiskProducts": [
                        "Ballantine's 17 Year",
                        "Premium Cognac Lines"
                    ],
                    "riskHotspots": [
                        "Southeast Asia",
                        "Eastern Europe",
                        "Border Regions"
                    ],
                    "threatLevel": "ELEVATED",
                    "recommendedActions": [
                        "Increase authentication visibility",
                        "Enhanced supply chain monitoring",
                        "Retailer training programs"
                    ]
                },
                "complianceMetrics": {
                    "overallScore": 97.8,
                    "categoryScores": {
                        "productAuthentication": 98.5,
                        "supplyChainIntegrity": 97.2,
                        "retailerCompliance": 96.8,
                        "dataManagement": 99.1
                    }
                }
            }
            return jsonify(reports), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @staticmethod
    def get_live_feed():
        """Get real-time activity feed from recorded scans"""
        try:
            # Get recent scans from database
            scans = Scan.get_recent_scans(limit=12)
            feed = [scan.to_dict() for scan in scans]
            
            # If no scans yet, return empty list
            if not feed:
                return jsonify([]), 200
                
            return jsonify(feed), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def record_scan(product_name, status, location=None, retailer=None, device_id=None, confidence=None):
        """Record a new scan from NFC scanner"""
        try:
            scan = Scan.create_scan(
                product_name=product_name,
                status=status,
                location=location,
                retailer=retailer,
                device_id=device_id,
                confidence=confidence
            )
            return jsonify({
                "message": "Scan recorded successfully",
                "scan": scan.to_dict()
            }), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @staticmethod
    def get_settings():
        """Get system settings"""
        try:
            settings = {
                "company": {
                    "name": "Pernod Ricard",
                    "operatingHours": "9:00 AM - 5:00 PM",
                    "timezone": "Africa/Johannesburg",
                    "language": "English",
                    "currency": "ZAR"
                },
                "notifications": {
                    "emailAlerts": True,
                    "smsAlerts": False,
                    "pushNotifications": True,
                    "alertThreshold": "High"
                },
                "security": {
                    "twoFactorAuth": True,
                    "sessionTimeout": 30,
                    "passwordPolicy": "highSecurity",
                    "auditLogEnabled": True
                },
                "integration": {
                    "apiKey": "sk_live_xxxxxxxxxxxx",
                    "webhookUrl": "https://api.example.com/webhooks",
                    "retryPolicy": "exponential"
                }
            }
            return jsonify(settings), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
