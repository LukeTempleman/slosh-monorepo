#!/usr/bin/env python
"""
Seed sample batch data for testing the Batches API
Run: python seed_batches.py
"""

from app import create_app, db
from app.models import Batch, BatchStatus, RiskLevel
from datetime import datetime, timedelta
import random

def seed_batches():
    """Create sample batch data"""
    
    app = create_app()
    
    with app.app_context():
        # Clear existing batches (optional - comment out to keep existing data)
        # Batch.query.delete()
        
        # Sample products
        products = [
            "Jameson Irish Whiskey",
            "Chivas Regal 12 Year",
            "Absolut Vodka",
            "Grey Goose Vodka",
            "Johnnie Walker Black Label",
            "Hennessy XO Cognac",
            "Bacardi Superior Rum",
            "Tanqueray Gin",
            "Smirnoff Vodka",
            "Jack Daniel's Tennessee Whiskey"
        ]
        
        # Sample locations
        locations = [
            "Johannesburg",
            "Cape Town",
            "Durban",
            "Pretoria",
            "Port Elizabeth",
            "Bloemfontein",
            "Polokwane"
        ]
        
        # Create 30 sample batches
        base_date = datetime.utcnow()
        
        for i in range(30):
            batch_id = f"BN{str(i+1).zfill(4)}"
            product = random.choice(products)
            status = random.choice(list(BatchStatus))
            risk_level = random.choice(list(RiskLevel))
            quality_score = random.uniform(60, 100)
            quantity = random.randint(1000, 10000)
            location = random.choice(locations)
            days_ago = random.randint(0, 30)
            created_date = base_date - timedelta(days=days_ago)
            
            batch = Batch(
                id=batch_id,
                product_name=product,
                quantity=quantity,
                status=status.value,
                quality_score=round(quality_score, 2),
                risk_level=risk_level.value,
                location=location,
                created_at=created_date,
                created_by=1,  # Assuming user with ID 1 exists
                notes=f"Sample batch for testing. Status: {status.value}"
            )
            
            db.session.add(batch)
            print(f"✓ Created batch {batch_id} - {product} ({status.value})")
        
        try:
            db.session.commit()
            print(f"\n✅ Successfully seeded {30} sample batches!")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error seeding batches: {str(e)}")

if __name__ == '__main__':
    seed_batches()
