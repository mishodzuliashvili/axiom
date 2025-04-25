import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
  // 1. get input which usernam user want and show if it already taken or not if not go next
  // 2. create private and public key here and save them in somewhere secure place on browser
  // 3. create in database new user with his chosen usernmae and publicKey
    
  return (
    <div>
      <LoginForm />
    </div>
  );
}
