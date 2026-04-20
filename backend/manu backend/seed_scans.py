"""Seed scan records for testing"""
import sys
from datetime import datetime, timedelta
from app import create_app, db
from app.models import Scan

app = create_app()

with app.app_context():
    # Create tables if they don't exist
    db.create_all()
    
    # Clear existing scans
    Scan.query.delete()
    
    # Product and location data
    products = [
        "Jameson Irish Whiskey",
        "Chivas Regal 12 Year",
        "Absolut Vodka",
        "Martell Cordon Bleu",
        "Perrier-Jouët",
        "Ballantine's",
        "Royal Salute",
        "Olmeca"
    ]
    
    retailers = [
        "Liquor City",
        "Pick n Pay",
        "Makro",
        "Checkers",
        "Woolworths",
        "Shoprite",
        "Norman Goodfellows",
        "Ultra Liquors"
    ]
    
    locations = [
        "Johannesburg CBD",
        "Cape Town Waterfront",
        "Durban North",
        "Pretoria Avenue",
        "Bloemfontein Center",
        "Port Elizabeth East",
        "East London West",
        "Polokwane South"
    ]
    
    statuses = ["Authentic", "Suspicious", "Failed"]
    devices = [f"Device-{i}" for i in range(101, 125)]
    
    scans_created = 0
    base_time = datetime.utcnow()
    
    # Create 50 scan records with varied timestamps
    for i in range(50):
        product = products[i % len(products)]
        retailer = retailers[i % len(retailers)]
        location = locations[i % len(locations)]
        status = statuses[i % len(statuses)]
        device = devices[i % len(devices)]
        confidence = 95 + (i % 5)  # 95-99% confidence mostly
        
        # Vary the timestamps
        timestamp = base_time - timedelta(seconds=i * 30)  # 30 seconds apart
        
        if status == "Failed":
            confidence = 20 + (i % 30)
        elif status == "Suspicious":
            confidence = 60 + (i % 30)
        
        scan = Scan(
            product_name=product,
            status=status,
            location=location,
            retailer=retailer,
            device_id=device,
            confidence=confidence,
            created_at=timestamp
        )
        
        db.session.add(scan)
        scans_created += 1
    
    try:
        db.session.commit()
        print(f"✅ Successfully seeded {scans_created} scan records")
        print(f"📊 Scan Records Created:")
        
        # Print summary
        count_by_status = Scan.get_scan_count_by_status()
        for status, count in count_by_status.items():
            print(f"   {status}: {count}")
        
        recent = Scan.get_recent_scans(limit=5)
        print(f"\n📡 Most Recent Scans:")
        for scan in recent:
            print(f"   {scan.product_name} ({scan.status}) - {scan.location}")
            
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error seeding scans: {e}")
        sys.exit(1)
