using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Quobject.SocketIoClientDotNet.Client;


namespace eye_tracker_provider_csharp
{
    class SocketHandler
    {
        private Socket socket;

        public SocketHandler()
        {
            this.socket = IO.Socket("http://localhost:3000");
            this.socket.On(Socket.EVENT_CONNECT, () =>
            {

            });
        }
    }
}
