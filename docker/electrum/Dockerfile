FROM ubuntu:18.04
MAINTAINER mempool.space developers
EXPOSE 50002

# runs as UID 1000 GID 1000 inside the container
RUN set -x \
        && apt-get update \
	&& DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends gpg gpg-agent dirmngr \
	&& DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends wget xpra python3-pyqt5 python3-wheel \
	python3-pip python3-setuptools libsecp256k1-0 libsecp256k1-dev python3-numpy python3-dev build-essential \
	python3-pyqt5 libsecp256k1-0 python3-cryptography


ENV VERSION 4.1.5

WORKDIR /tmp
RUN gpg --keyserver hkps://keys.openpgp.org --recv-keys 0EEDCFD5CAFB459067349B23CA9EEEC43DF911DC
RUN wget https://download.electrum.org/${VERSION}/Electrum-${VERSION}.tar.gz
RUN wget -O sombernight.electrum.org.asc https://download.electrum.org/${VERSION}/Electrum-${VERSION}.tar.gz.sombernight_releasekey.asc
RUN gpg --verify sombernight.electrum.org.asc Electrum-${VERSION}.tar.gz
RUN gpg --keyserver keyserver.ubuntu.com  --receive-keys 0EEDCFD5CAFB459067349B23CA9EEEC43DF911DC
COPY docker/electrum/sombernight_releasekey.asc .
RUN gpg --verify sombernight_releasekey.asc Electrum-${VERSION}.tar.gz
RUN rm -f sombernight_releasekey.asc

#RUN gpg --keyserver hkps://keys.openpgp.org --recv-keys 6694D8DE7BE8EE5631BED9502BD5824B7F9470E6
#RUN wget https://download.electrum.org/${VERSION}/Electrum-${VERSION}.tar.gz
#RUN wget -O ThomasV.electrum.org.asc https://download.electrum.org/${VERSION}/Electrum-${VERSION}.tar.gz.ThomasV.asc
#RUN gpg --verify ThomasV.electrum.org.asc Electrum-${VERSION}.tar.gz
#RUN gpg --keyserver keyserver.ubuntu.com  --receive-keys 6694D8DE7BE8EE5631BED9502BD5824B7F9470E6
#COPY docker/electrum/ThomasV_releasekey.asc .
#RUN gpg --verify ThomasV_releasekey.asc Electrum-${VERSION}.tar.gz
#RUN rm -f ThomasV_releasekey.asc

#TODO implement Emzy signature verification

RUN set -x \
	&& pip3 install /tmp/Electrum-${VERSION}.tar.gz \
	&& test -f /usr/local/bin/electrum \
	&& rm -vrf /tmp/Electrum-${VERSION}.tar.gz /tmp/Electrum-${VERSION}.tar.gz.asc ${HOME}/.gnupg \
	&& apt-get purge --autoremove -y python3-wheel python3-pip python3-setuptools python3-dev build-essential libsecp256k1-dev curl gpg gpg-agent dirmngr \
	&& apt-get clean && rm -rf /var/lib/apt/lists/* \
	&& useradd -d /home/mempool -m mempool \
	&& mkdir /electrum \
	&& ln -s /electrum /home/mempool/.electrum \
	&& chown mempool:mempool /electrum

USER mempool
ENV HOME /home/mempool
WORKDIR /home/mempool
VOLUME /electrum

#CMD ["/usr/bin/xpra", "start", ":100", "--start-child=/usr/local/bin/electrum", "--bind-tcp=0.0.0.0:50002","--daemon=yes", "--notifications=no", "--mdns=no", "--pulseaudio=no", "--html=off", "--speaker=disabled", "--microphone=disabled", "--webcam=no", "--printing=no", "--dbus-launch=", "--exit-with-children"]
#ENTRYPOINT ["electrum"]
