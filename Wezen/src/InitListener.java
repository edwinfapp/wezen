
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

/**
 * Application Lifecycle Listener implementation class InitListener
 *
 */
@WebListener
public class InitListener implements ServletContextListener {

	static boolean active = true;

	public InitListener() {
	}

	public void contextDestroyed(ServletContextEvent arg0) {
		active = false;
	}

	public void contextInitialized(ServletContextEvent arg0) {
	}

}
