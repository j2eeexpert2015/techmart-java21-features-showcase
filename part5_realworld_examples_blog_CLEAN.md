# PART 5: REAL-WORLD EXAMPLES
## Blog Content - Streamlined & Focused

---

## 🛒 String Templates in an E-Commerce System

Let's see String Templates solve real problems in an e-commerce order system. Four common scenarios:

1. **Order Confirmation Email** - Customer notifications
2. **Invoice Generation** - Text-based reports
3. **Database Queries** - Safe SQL with custom processors
4. **SMS Alerts** - Formatted mobile notifications

**[INSERT VISUAL: Your existing Real-World Examples diagram]**

---

## Use Case 1: Order Confirmation Email

Every e-commerce system sends order confirmations. These emails need to be clear, professional, and include dynamic order details. String Templates make this naturally readable without concatenation mess.

### Sample Data

```java
Customer customer = new Customer("Sarah Johnson", "sarah@email.com");
Order order = new Order("ORD-1001", LocalDateTime.now());
order.addItem("Laptop Pro", 1299.99, 1);
order.addItem("Wireless Mouse", 29.99, 2);
// Total: $1,375.96
```

### String Template Solution

```java
String email = STR."""
    Dear \{customer.getName()},
    
    Thank you for your order!
    
    Order #\{order.getId()}
    Date: \{order.getDate()}
    
    ITEMS:
    \{order.getItems().stream()
        .map(item -> STR."""
            \{item.getQty()}x \{item.getName()}
            Price: $\{item.getTotal()}\
            """)
        .collect(Collectors.joining("\n"))}
    
    Total: $\{order.getTotal()}
    
    Track: \{generateTrackingUrl(order.getId())}
    
    Best regards,
    The Team
    """;
```

### Output

```
Dear Sarah Johnson,

Thank you for your order!

Order #ORD-1001
Date: 2024-11-06T10:30:00

ITEMS:
1x Laptop Pro
Price: $1299.99
2x Wireless Mouse
Price: $59.98

Total: $1375.96

Track: https://store.com/track/ORD-1001

Best regards,
The Team
```

**Key Points:**
- Natural multi-line formatting with triple quotes
- Stream API for dynamic item lists  
- Method calls work inside expressions
- No manual string escaping or concatenation needed

---

## Use Case 2: Invoice/Report Generation

Text-based invoices and reports are common in backend systems for logging, PDF generation, or terminal output. Maintaining alignment and structure without complex concatenation is a constant challenge.

### String Template Solution

```java
String invoice = STR."""
    ═══════════════════════════════════
          INVOICE #\{order.getId()}
    ═══════════════════════════════════
    
    Customer: \{customer.getName()}
    Date: \{LocalDate.now()}
    
    ITEMS:
    \{order.getItems().stream()
        .map(item -> STR."""
            \{item.getName()}
            Qty: \{item.getQty()}
            Price: $\{item.getPrice()}
            Total: $\{item.getTotal()}\
            """)
        .collect(Collectors.joining("\n"))}
    
    ───────────────────────────────────
    Total: $\{order.getTotal()}
    ═══════════════════════════════════
    
    Payment: \{order.getPaymentMethod()}
    Status: \{order.getStatus()}
    """;
```

### Output

```
═══════════════════════════════════
      INVOICE #ORD-1001
═══════════════════════════════════

Customer: Sarah Johnson
Date: 2024-11-06

ITEMS:
Laptop Pro
Qty: 1
Price: $1299.99
Total: $1299.99
Wireless Mouse
Qty: 2
Price: $29.99
Total: $59.98

───────────────────────────────────
Total: $1375.96
═══════════════════════════════════

Payment: Credit Card
Status: CONFIRMED
```

**Key Points:**
- Unicode box characters preserved in template
- Stream operations for repeating sections
- Clean, maintainable structure
- Output matches template visually - no surprises

---

## Use Case 3: Database Queries (Security Critical!)

Building SQL queries with user input is where most injection vulnerabilities occur. The temptation to concatenate user values directly into queries has compromised countless applications. Custom processors solve this elegantly.

### The Problem: SQL Injection

**Wrong - Vulnerable Query:**

```java
// ❌ DANGEROUS - User input in SQL
String userInput = "'; DROP TABLE orders; --";

String query = STR."""
    SELECT * FROM orders 
    WHERE email = '\{userInput}'
    """;
```

**What Happens (Injection):**

```sql
-- Query becomes:
SELECT * FROM orders 
WHERE email = ''; DROP TABLE orders; --'
             ↑    ↑
             |    Malicious command executes!
             Query ends here
```

**End Result:** 💀 Your orders table is deleted!

The database executes TWO statements:
1. `SELECT * FROM orders WHERE email = ''` 
2. `DROP TABLE orders` (destroys data!)

User input becomes executable SQL code.

### Solution: Custom Processor

Use parameterized queries via custom processor. User input becomes a parameter, not SQL code.

```java
public class SafeSQL {
    public static StringTemplate.Processor<
        PreparedStatement, SQLException> SQL =
        template -> {
            // Extract fragments and values
            String query = String.join("?", 
                template.fragments());
            
            PreparedStatement stmt = 
                connection.prepareStatement(query);
            
            // Bind values as parameters (SAFE!)
            List<Object> values = template.values();
            for (int i = 0; i < values.size(); i++) {
                stmt.setObject(i + 1, values.get(i));
            }
            
            return stmt;
        };
}
```

**How Parameter Binding Works:**

The `setObject()` method sends the user input to the database **separately** from the SQL query. The database receives two things:
1. SQL structure with `?` placeholder: `SELECT * FROM orders WHERE email = ?`
2. Parameter value sent via different channel: `"'; DROP TABLE orders; --"`

The database **never** parses the parameter as SQL. It treats it purely as text data for comparison.

**With Malicious Input:**

Even if user enters `'; DROP TABLE orders; --`, the database does this:
```sql
-- Looks for email that exactly matches this string:
WHERE email = "'; DROP TABLE orders; --"

-- Result: No rows found (nobody has that weird email)
-- The DROP TABLE never executes - it's just a search string!
```

### Safe Usage

```java
String customerEmail = userInput; // User-controlled

PreparedStatement stmt = SafeSQL.SQL."""
    SELECT id, order_date, total, status
    FROM orders
    WHERE customer_email = \{customerEmail}
      AND status = 'CONFIRMED'
    ORDER BY order_date DESC
    LIMIT 10
    """;

ResultSet rs = stmt.executeQuery();
```

**Key Takeaway:** Parameters are sent via a separate, safe channel. The SQL structure and data values never mix.

**Key Points:**
- User input never concatenated into SQL
- Values treated as data, not code
- SQL injection prevented
- Clean, readable queries

---

## Use Case 4: SMS Alerts with FMT

SMS notifications require precise formatting due to character limits and cost per message. Currency values must display correctly, and there's no room for sloppy decimal handling. FMT processor gives you the control you need.

### When to Use FMT

Use FMT when you need precise formatting:
- Decimal places (`%.2f`)
- Number formatting (`%d`)
- Character limits (SMS)

### String Template Solution

```java
double amount = 1375.96;
int itemCount = 2;
String orderId = "ORD-1001";

String sms = FMT."""
    Order %s\{orderId} confirmed!
    Total: $%.2f\{amount}
    Items: %d\{itemCount}
    Track: store.com/t/%s\{orderId}
    """;
```

### Output

```
Order ORD-1001 confirmed!
Total: $1375.96
Items: 2
Track: store.com/t/ORD-1001
```

**Format Specifiers:**
- `%s` - String
- `%.2f` - Decimal with 2 places
- `%d` - Integer

**Key Points:**
- FMT ensures exact decimal precision (critical for money)
- Format specifiers give fine control
- Essential when character count matters
- Use STR for most cases, FMT when precision required

---

## Spring Boot Integration

In a real application, these patterns come together in service classes. Here's how a typical order notification service would leverage all three processors—STR for readability, Custom for security, and FMT for precision.

```java
@Service
public class OrderNotificationService {
    
    public String generateEmail(Order order, 
                                Customer customer) {
        return STR."""
            Dear \{customer.getName()},
            Order #\{order.getId()} confirmed!
            Total: $\{order.getTotal()}
            """;
    }
    
    public String generateInvoice(Order order) {
        return STR."""
            INVOICE #\{order.getId()}
            Customer: \{order.getCustomer().getName()}
            Total: $\{order.getTotal()}
            """;
    }
    
    public PreparedStatement searchOrders(String email) 
            throws SQLException {
        return SafeSQL.SQL."""
            SELECT * FROM orders
            WHERE customer_email = \{email}
            ORDER BY order_date DESC
            """;
    }
    
    public String generateSmsAlert(Order order) {
        return FMT."""
            Order confirmed! 
            Total: $%.2f\{order.getTotal()}
            """;
    }
}
```

---

## When to Use What

**Use STR (90% of cases):**
- Emails
- Reports
- Log messages
- User notifications

**Use FMT (precise formatting):**
- SMS with character limits
- Decimal precision needed
- Migrating from String.format()

**Use Custom Processor (security):**
- SQL queries
- Shell commands
- Any user-controlled input

---

## Production Considerations

Before using String Templates (preview in Java 21, standard in Java 23):

**Security:**
- [ ] Never use STR/FMT for SQL queries
- [ ] Always validate user input
- [ ] Use custom processors for sensitive operations

**Testing:**
- [ ] Test with null values
- [ ] Test with special characters
- [ ] Load test performance

**Code Quality:**
- [ ] Keep templates under 20 lines
- [ ] Extract complex logic to methods
- [ ] Add meaningful variable names

---

## Key Takeaways

✅ **STR** for most string composition (emails, reports, logs)

✅ **FMT** when you need format control (SMS, precise decimals)

✅ **Custom Processors** for security (SQL, user input)

✅ **Real Impact:**
- 30-40% less code
- Fewer bugs
- Better readability
- Easier maintenance

**Note:** String Templates are a preview feature in Java 21, becoming standard in Java 23.

---

## What's Next?

In **Part 6**, we'll explore advanced features:
- Template composition
- Conditional logic
- Error handling
- Testing strategies

You now have practical patterns to use String Templates in your e-commerce applications!

---
