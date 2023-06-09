package lk.ijse.dep10.pos.api;


import lk.ijse.dep10.pos.dto.CustomerDTO;
import lk.ijse.dep10.pos.dto.ItemDTO;
import lk.ijse.dep10.pos.dto.ResponseErrorDTO;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.*;

@RestController
@RequestMapping("/items")
@CrossOrigin
public class ItemController {

    @Autowired
    private BasicDataSource pool;

    @PostMapping
    public ResponseEntity<?> saveItem(@RequestBody ItemDTO item){
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        try (Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement
                    ("INSERT INTO dep10_pos.item (dep10_pos.item.description, quantity, price) VALUES (?,?,?)",
                            Statement.RETURN_GENERATED_KEYS);
            stm.setString(1,item.getDescription() );
            stm.setInt(2, item.getStock());
            stm.setInt(3, item.getPrice());
            stm.executeUpdate();
            ResultSet generatedKeys = stm.getGeneratedKeys();
            generatedKeys.next();
            int id = generatedKeys.getInt(1);
            item.setId(id);
            return new ResponseEntity<>(item, HttpStatus.CREATED);
        } catch (SQLException e) {
            if (e.getSQLState().equals("23000")){
                return new ResponseEntity<>(
                        new ResponseErrorDTO(HttpStatus.CONFLICT.value(),e.getMessage()),
                        HttpStatus.CONFLICT);
            }else{
                return new ResponseEntity<>(
                        new ResponseErrorDTO(500, e.getMessage()),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
