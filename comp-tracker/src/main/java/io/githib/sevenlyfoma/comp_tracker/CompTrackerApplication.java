package io.githib.sevenlyfoma.comp_tracker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class CompTrackerApplication {

	private static final Logger logger = LoggerFactory.getLogger(CompTrackerApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(CompTrackerApplication.class, args);
	}

	// @Bean
    // public CommandLineRunner demo(UserRepository repository) {
    //     return (args) -> {

	// 		// repository.save(new User("testExample", "textex@example.com", "it/its", Long.valueOf(1200)));
    
    //         // fetch all customers
    //         logger.info("Customers found with findAll():");
    //         logger.info("-------------------------------");
    //         repository.findAll().forEach(customer -> {
    //             logger.info(customer.toString());
    //         });
    //         logger.info("");

    //         // fetch an individual customer by ID
    //         // User customer = repository.findById(1L);
    //         // logger.info("Customer found with findById(1L):");
    //         // logger.info("--------------------------------");
    //         // logger.info(customer.toString());
    //         // logger.info("");

    //         // logger.info("Customer found with findByLastName('Bauer'):");
    //         // logger.info("--------------------------------------------");
    //         // repository.findByName("testExample").forEach(bauer -> {
    //         //     logger.info(bauer.toString());
    //         // });
    //         // logger.info("");
    //     };
    // }

}
