<nav class="vsee-navbar navbar navbar-expand-md navbar-light">
    <div class="container">
        <a class="navbar-brand" href="/">
            <img src="/images/logo.png" alt="logo" width="90">
        </a>
        @if(auth()->check())
            <div class="collapse navbar-collapse justify-content-end">
                <ul class="navbar-nav">
                    <li class="nav-item active">
                        <a class="nav-link" href="#" onclick="document.getElementById('logoutForm').submit();"><i class="fa fa-desktop"></i> {{auth()->user()->name}} <span class="sr-only">(current)</span></a>
                        <form action="{{route('logout')}}" method="post" id="logoutForm">
                            {{csrf_field()}}
                        </form>
                    </li>
                </ul>
            </div>
        @endif
    </div>
</nav>
