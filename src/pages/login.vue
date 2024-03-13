<template>
    <f7-page>
        <f7-navbar title="WarungPOS"></f7-navbar>
        <div id="containerHome">
            <f7-block id="textBanner">
                <p>Dapatkan keunggulan dalam pengelolaan usaha Anda dengan solusi Point of Sales modern kami yang tidak
                    hanya menyederhanakan transaksi, tetapi juga memberikan wawasan mendalam tentang inventaris,
                    penjualan, dan perilaku pelanggan. Tingkatkan efisiensi, pantau kinerja toko, dan ciptakan
                    pengalaman belanja yang lebih baik bagi pelanggan Anda dengan teknologi POS yang andal dan inovatif!
                </p>
                <img src="../assets/womanwarung.png" width="300x" class="lazy" />
            </f7-block>
            <f7-block>
                <f7-button raised large fill @click="loginScreenOpened = true">LOGIN</f7-button>
            </f7-block>
        </div>

        <f7-login-screen v-model:opened="loginScreenOpened" class="demo-login-screen">
            <f7-page login-screen>
                <f7-login-screen-title>WarungPOS</f7-login-screen-title>
                <f7-list form>
                    <f7-list-input label="email" type="email" placeholder="Your email" :value="email"
                        @input="email = $event.target.value"></f7-list-input>
                    <f7-list-input label="Password" type="password" placeholder="Your password" :value="password"
                        @input="password = $event.target.value"></f7-list-input>
                </f7-list>
                <f7-list inset>
                    <f7-list-button @click="signIn">Masuk</f7-list-button>
                    <f7-list-button @click="backToHome">Keluar</f7-list-button>
                </f7-list>
            </f7-page>
        </f7-login-screen>
    </f7-page>
</template>

<style>
#containerHome {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

#textBanner {
    text-align: center;
    padding: 20px;
}
</style>

<script>
import { f7, f7Navbar, f7Page, f7LoginScreen, f7List, f7ListButton, f7ListInput } from 'framework7-vue';

export default {
    components: {
        f7Navbar,
        f7Page,
        f7LoginScreen,
        f7List,
        f7ListButton,
        f7ListInput,
    },
    data() {
        return {
            loginScreenOpened: false,
            email: 'aji@gmail.com',
            password: 'aji123',
        };
    },
    methods: {
        async signIn() {
            try {
                const response = await fetch('https://karot.dev.catalis.app/api/v1/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: this.email,
                        password: this.password,
                    }),
                });

                const data = await response.json();

                console.log(data.data.token);

                localStorage.setItem('token', data.data.token);

                this.loginScreenOpened = false;

                f7.views.main.router.navigate('/cariToko/');
            } catch (error) {
                console.error('Error signing in:', error);
            }
        },
        backToHome() {
            this.loginScreenOpened = false;
        },
    },
    mounted() {
        // Menambahkan f7router sebagai properti pada objek global f7
        f7.f7router = this.$f7router;
    },
};
</script>
