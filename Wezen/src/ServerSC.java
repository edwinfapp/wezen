import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import com.google.gson.Gson;

@ServerEndpoint(value = "/srv")
public class ServerSC {

	// mapa con la info del jugador por sid
	private static Map<String, Player> playerMap = new ConcurrentHashMap<>();

	// mapa con los datos de juego por sid
	private static Map<String, Data> dataMap = new ConcurrentHashMap<>();

	// Mapa con los datos del juego por nombre del juego.
	private static Map<String, List<Info>> infoMap = new ConcurrentHashMap<>();

	// Mapa con las sesiones del juego por nombre del juego.
	private static Map<String, List<Session>> sessionMap = new ConcurrentHashMap<>();

	// ------------------------------------------------------------

	@OnOpen
	public void onOpen(Session session) throws IOException {
		System.out.println("onOpen");
	}

	@OnMessage
	public void onMessage(String message, Session session) throws IOException {

		try {

			// ---------------------------------------------

			// System.out.println("in:" + message);

			String sid = session.getId();

			// System.out.println("sid: " + sid);

			Player p = playerMap.get(sid);

			if (p == null) {
				p = new Player();
				p.game = "default";
				playerMap.put(sid, p);
			}

			List<Info> infoList = infoMap.get(p.game);
			List<Session> sessionList = sessionMap.get(p.game);

			if (infoList == null) {
				infoList = Collections.synchronizedList(new ArrayList<>());
				infoMap.put(p.game, infoList);

				sessionList = Collections.synchronizedList(new ArrayList<>());
				sessionMap.put(p.game, sessionList);
			}

			Data data = dataMap.get(sid);

			if (data == null) {
				data = new Data();
				data.me = infoList.size();
				p.me = data.me;
				infoList.add(new Info());
				sessionList.add(session);
				dataMap.put(sid, data);
				System.out.println("New: " + sid);

				data.cr = infoList;
			}

			// si es un mensaje de replica..
			if (message.indexOf("DD") == 0) {

				for (final Session s : sessionList) {

					// se notifica excepto el mismo
					if (s != null && !s.getId().equals(session.getId())) {

						new Thread(new Runnable() {

							@Override
							public void run() {
								synchronized (s) {
									try {
										s.getBasicRemote().sendText(message);
									} catch (IOException e) {
										e.printStackTrace();
									}
								}

							}
						}).start();

					}

				}

				return;
			}

			// --- Guardar la info en el mapa

			try {
				Info info = new Gson().fromJson(message, Info.class);
				if (info != null) {
					infoList.set(p.me, info);
				}
			} catch (Exception e) {
			}

			String sdata = new Gson().toJson(data);

			synchronized (session) {
				// System.out.println("return:" + sdata);
				session.getBasicRemote().sendText(sdata);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@OnClose
	public void onClose(Session session) throws IOException {
		System.out.println("close " + session.getId());

		String sid = session.getId();

		Player p = playerMap.remove(sid);

		if (p == null) {
			return;
		}

		dataMap.remove(sid);

		List<Info> infoList = infoMap.get(p.game);
		List<Session> sessionList = sessionMap.get(p.game);

		infoList.set(p.me, null);
		sessionList.set(p.me, null);

		// verifica que exista alguien en el grupo... sino limpia la lista

		boolean isEmpty = true;
		for (Info info : infoList) {
			if (info != null) {
				isEmpty = false;
			}
		}

		if (isEmpty) {
			System.out.println("Limpiada..!");
			infoList.clear();
			sessionList.clear();
		}

	}

	@OnError
	public void onError(Session session, Throwable throwable) {
		try {
			onClose(session);
		} catch (IOException e) {
		}
	}

	// ------------------

	public static class Player {
		public String game;
		public int me;
	}

	public static class Data {
		public int me;
		public List<Info> cr = Collections.synchronizedList(new ArrayList<>());
	}

	public static class Info {
		public double x = 0, y = 0, z = 2.8, // ubicacion
				v = 1, // velocidad
				r = 0, // rotacion
				i = 0, // inclinacion
				e = 0, // energia
				c = 0, // tiempo con campo de energia
				p = 0 // puntaje
		;
	}

}